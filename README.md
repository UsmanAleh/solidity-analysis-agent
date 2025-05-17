# Solidity Analysis Agent

A local-first AI assistant that runs entirely in your browser, capable of understanding Solidity smart contracts, identifying potential vulnerabilities, and suggesting code improvements. No server-side processing means your code stays private.

<img src="/public/ss1.png" width="49%"/> <img src="/public/ss2.png" width="49%"/> 

## Features

- **Local-First Processing**: All analysis happens in your browser using WebLLM - no data is sent to external servers, ensuring complete privacy.
- **Deep Code Comprehension**: Understands the intricacies of your Solidity smart contracts.
- **Automated Vulnerability Detection**: Proactively identifies common security vulnerabilities.
- **Actionable Improvement Suggestions**: Offers concrete recommendations for optimizing gas usage, enhancing security, and improving code clarity.
- **Smart Contract Analysis**: Upload or paste Solidity code for automated security analysis.
- **Interactive Chat**: Ask natural language questions about your smart contract.
- **Code Highlighting**: Syntax highlighting for better code readability.

## Use Cases

- **Security Audits**: Get a preliminary security review of your smart contracts, identifying potential vulnerabilities like reentrancy, integer overflows, and access control issues.
- **Code Optimization**: Discover opportunities to reduce gas costs and improve the efficiency of your contract functions.
- **Best Practice Adherence**: Learn if your contract follows established Solidity best practices and receive suggestions for alignment.
- **Complex Logic Explanation**: Ask questions like `What does this complex function do?`, `Explain the inheritance structure`, or `Is this contract upgradeable?`
- **Targeted Queries**: Get insights on specific parts of your code, for example, `What are the potential risks in the transferFrom function?` or `How can I make the _mint function safer?`

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

1. **Upload or Paste**: Add your smart contract (Solidity code or ABI JSON).
2. **Analyze**: The app uses WebLLM to perform a comprehensive analysis of the contract, understanding its logic, identifying potential vulnerabilities, and pinpointing areas for improvement.
3. **Chat & Explore**: Ask specific questions about your contract in natural language. Dive deeper into identified vulnerabilities or suggested improvements.
4. **Review & Implement**: Examine the detailed analysis, understand the identified issues, and implement the suggested improvements to enhance your smart contract.

## Technology Stack

- **Frontend**: React + Tailwind CSS
- **Local LLM**: WebLLM (MLC-AI)
- **Model**: Qwen3-0.6B-q0f16-MLC

## Privacy

This application runs entirely in your browser. Your smart contract code and conversations are never sent to a server, ensuring complete privacy and security.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
