import type { AnalysisResult } from "../types/index";

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisResults = ({ results, isLoading }: AnalysisResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex rounded-lg border border-gray-700">
        <div className="px-4 py-4">
          <p>Analyzing smart contract...</p>
          <p className="">
            This may take a few moments depending on contract complexity
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-slate-400";
      default:
        return "text-gray-400";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "high":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-orange-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "medium":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "low":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className="flex h-full flex-col rounded-[20px] border border-gray-700 px-4 pb-4">
      <div>
        <h2 className="m-4 ml-0 text-3xl font-bold text-white">
          Analysis Summary
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="shadow-sm">
          <p className="rounded-lg bg-gray-900 p-4 font-mono text-sm">
            {results.summary}
          </p>
        </div>

        {results.vulnerabilities.length > 0 && (
          <div className="">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="m-4 ml-2 text-xl font-bold text-white">
                Vulnerabilities ({results.vulnerabilities.length})
              </h3>
            </div>

            <div className="space-y-4">
              {results.vulnerabilities.map((vulnerability, index) => (
                <div
                  key={index}
                  className={`rounded-lg border border-gray-700 p-4 shadow-sm`}
                >
                  <div className="flex items-center">
                    {getSeverityIcon(vulnerability.severity)}
                    <h5
                      className={`text-md ml-2 font-bold ${getSeverityColor(
                        vulnerability.severity,
                      )}`}
                    >
                      {vulnerability.type.toUpperCase()}
                    </h5>
                  </div>
                  <span className="text-sm text-gray-300">
                    {vulnerability.description}
                  </span>
                  <div className="my-4 rounded-lg bg-gray-900 p-4 font-mono text-sm">
                    {vulnerability.location}
                  </div>
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <p className="text-sm font-bold">
                      <span className="text-gray-300">Recommendation:</span>{" "}
                      {vulnerability.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.suggestions.length > 0 && (
          <div>
            <div className="flex items-center">
              <h3 className="m-4 ml-2 text-xl font-bold text-white">
                💡 Suggestions ({results.suggestions.length})
              </h3>
            </div>
            <div className="space-y-4">
              {results.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-700 p-4 shadow-sm"
                >
                  <h5 className="text-md font-bold">
                    {suggestion.type.toUpperCase()}
                  </h5>
                  <p className="mt-2 text-sm text-gray-300">
                    {suggestion.description}
                  </p>
                  <p className="mt-4 text-sm font-bold">Location:</p>
                  <div className="mt-2 rounded-lg bg-gray-900 p-4 font-mono text-sm">
                    {suggestion.location}
                  </div>
                  {suggestion.code && (
                    <div className="rounded-lg-md overflow-x-auto shadow-sm">
                      <p className="mt-4 text-sm font-bold">Suggested Code:</p>
                      <pre className="mt-2 rounded-lg bg-gray-900 p-4 font-mono text-sm">
                        {suggestion.code}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
