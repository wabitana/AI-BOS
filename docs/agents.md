# Agent System

The Agent System (Phase 3) provides the core AI logic for AI-BOS. Agents execute specific goals, use tools, and maintain conversational memory. 

## Packages
- `@ai-bos/agents`: The workspace package that contains the `BaseAgent` framework and standard built-in agents (Research, Strategy, etc).

## Database
We store custom agent configurations and execution history to support cost-tracking and token accounting.
- `Agent`: Configuration (system prompt, assigned tools, etc).
- `AgentVersion`: Snapshots of the configuration for stability.
- `AgentExecution`: Runs of an agent tracking input/output, `tokensUsed`, and `cost`.

## BaseAgent
The `BaseAgent` class provides a unified interface for defining agent behavior. 
- It standardizes the output format (`AgentExecutionResult`).
- It automatically tracks token usage and costs and saves it to the `AgentExecution` table using Prisma.
- Built-in agents extend `BaseAgent` to define their behavior.

## Built-In Agents
- **ResearchAgent**: Queries search engines and summarizes findings.
- **StrategyAgent**: Develops step-by-step strategies based on goals.
