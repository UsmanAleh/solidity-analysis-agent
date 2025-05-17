# Solidity Analysis Agent

A local AI assistant that can understand and explain smart contracts. This application runs entirely in the browser using WebLLM, with no need for server-side processing.

<img src="/public/ss1.png" width="49%"/> <img src="/public/ss2.png" width="49%"/> 

## Features

- **Local-First Processing**: All analysis happens in your browser using WebLLM - no data is sent to external servers
- **Smart Contract Analysis**: Upload or paste Solidity code for automated security analysis
- **Interactive Chat**: Ask natural language questions about your smart contract
- **Code Highlighting**: Syntax highlighting for better code readability

## Use Cases

- Ask questions like `What does transferFrom do?` or `Is this contract upgradeable?`
- Get security vulnerability analysis for your smart contracts
- Identify optimization opportunities in your code
- Learn about smart contract best practices

## Getting Started

### Prerequisites

- A modern web browser with WebGPU support (Chrome 113+ recommended)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/usmankiani256/solidity-analysis-agent.git
   cd solidity-analysis-agent
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

4. Open your browser and navigate to the local server (usually <http://localhost:5173>)

### Building for Production

```
npm run build
```

The built application will be in the `dist` directory.

## How It Works

1. **Upload or Paste**: Add your smart contract (Solidity code or ABI JSON)
2. **Analyze**: The app uses WebLLM to analyze the contract and identify issues
3. **Chat**: Ask specific questions about your contract in natural language
4. **Review**: See detailed analysis of vulnerabilities and suggestions

## Technology Stack

- **Frontend**: React + Tailwind CSS
- **Local LLM**: WebLLM (MLC-AI)
- **Model**: Qwen3-0.6B-q0f16-MLC

## Privacy

This application runs entirely in your browser. Your smart contract code and conversations are never sent to a server, ensuring complete privacy and security.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
