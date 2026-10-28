import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import OpenAI from "openai";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const client = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.API_URL,
});

enum ModelTemperatureCfg {
  DEVELOPER = 0.1,
  NORMAL = 0.5,
  ADVENTURER = 1.3,
}

// 模型微调配置
const ModelAdjustmentConfig = {
  // 精确型任务
  cfg1: {
    temperature: 1, // Temperature（温度）
    top_p: 1, // Top-p（核采样）
    presence_penalty: 0, // Presence Penalty（存在惩罚）
    frequency_penalty: 0, // Frequency Penalty（频率惩罚）
  },
  // 平衡型任务（商业写作、技术文档）
  cfg2: {
    temperature: 1,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  },
  // 创意型任务（故事创作、头脑风暴）
  cfg3: {
    temperature: 1,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  },
};

// role: system, developer, user, assistant, tool
// content: 消息内容
// name: 消息发送者名称
// tool_calls: 工具调用
// tool_call_id: 工具调用ID
// tool_call_name: 工具调用名称
// tool_call_arguments: 工具调用参数
// tool_call_result: 工具调用结果
// tool_call_status: 工具调用状态
const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

function readDoc(relativePath: string) {
  return fs.readFileSync(
    fileURLToPath(new URL(relativePath, import.meta.url)),
    "utf-8",
  );
}

export function initPrompt() {
  const systemPrompt = readDoc("../docs/system_role_1.md");
  const userPrompt = readDoc("../docs/roles/user_role_3.md");
  messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: userPrompt });
}

async function streamReply(): Promise<string> {
  const stream = await client.chat.completions.create({
    messages,
    model: "deepseek-flash",
    reasoning_effort: "high",
    stream: true,
    temperature: ModelAdjustmentConfig.cfg2.temperature,
    top_p: ModelAdjustmentConfig.cfg2.top_p,
    presence_penalty: ModelAdjustmentConfig.cfg2.presence_penalty,
    frequency_penalty: ModelAdjustmentConfig.cfg2.frequency_penalty,
  });

  let content = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    if (!delta) continue;
    content += delta;
    stdout.write(delta);
  }
  stdout.write("\n\n");
  return content;
}

export async function startAgent() {
  const rl = createInterface({ input: stdin, output: stdout });
  stdout.write("输入消息后按回车发送，输入 exit 结束。\n");

  try {
    while (true) {
      let line: string;
      try {
        line = (await rl.question("> ")).trim();
      } catch {
        break;
      }
      if (!line) continue;
      if (line === "exit" || line === "quit") break;

      messages.push({ role: "user", content: line });
      try {
        const reply = await streamReply();
        messages.push({ role: "assistant", content: reply });
      } catch (error) {
        messages.pop();
        const message = error instanceof Error ? error.message : String(error);
        stdout.write(`\n请求失败: ${message}\n\n`);
      }
    }
  } finally {
    rl.close();
  }
}
