"use client";

import React, { useState } from "react";

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [isRadians, setIsRadians] = useState(true);

  const appendValue = (value) => {
    setExpression((prev) => prev + value);
  };

  const clear = () => {
    setExpression("");
    setResult("");
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const factorial = (num) => {
    if (num < 0) return NaN;
    if (num === 0 || num === 1) return 1;
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

  const calculate = () => {
    try {
      let expr = expression
        .replace(/π/g, Math.PI.toString())
        .replace(/e/g, Math.E.toString())
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/(\d+)!/g, (_, n) => `factorial(${n})`)
        .replace(/(\d+)\^(\d+)/g, "Math.pow($1,$2)");

      // Handle trigonometric functions with angle mode
      const trigFuncs = ["sin", "cos", "tan"];
      trigFuncs.forEach((func) => {
        const regex = new RegExp(`${func}\\(`, "g");
        expr = expr.replace(
          regex,
          isRadians ? `Math.${func}(` : `Math.${func}((Math.PI/180)*`
        );
      });

      // Handle log and ln
      expr = expr.replace(/log\(/g, "Math.log10(");
      expr = expr.replace(/ln\(/g, "Math.log(");

      // Handle exp
      expr = expr.replace(/exp\(/g, "Math.exp(");

      // Evaluate
      const evaluated = new Function("Math", "factorial", `return ${expr}`)(
        Math,
        factorial
      );

      setResult(evaluated.toString());

      // Save history
      setHistory((prev) => [
        { expression, result: evaluated },
        ...prev.slice(0, 9),
      ]);
    } catch (error) {
      setResult("Error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
      <div className="flex flex-col md:flex-row items-start gap-6 w-full justify-center">
        <div className="w-full md:w-2/3 p-4">
          <div className="bg-gray-100 p-4 rounded text-right text-3xl mb-4 h-24">
            <div className="text-xl text-gray-500">{expression || "0"}</div>
            <div>{result || ""}</div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {/* Row 1 */}
            <button
              className={`${
                isRadians ? "bg-blue-300" : "bg-gray-200"
              } hover:bg-gray-300 rounded py-3 text-lg`}
              onClick={() => setIsRadians(true)}
            >
              Rad
            </button>
            <button
              className={`${
                !isRadians ? "bg-blue-300" : "bg-gray-200"
              } hover:bg-gray-300 rounded py-3 text-lg`}
              onClick={() => setIsRadians(false)}
            >
              Deg
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={backspace}
            >
              ⌫
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("!")}
            >
              x!
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("(")}
            >
              (
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue(")")}
            >
              )
            </button>

            {/* Row 2 */}
            <button className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg">
              Inv
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("sin(")}
            >
              sin
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("ln(")}
            >
              ln
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("7")}
            >
              7
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("8")}
            >
              8
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("9")}
            >
              9
            </button>

            {/* Row 3 */}
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("π")}
            >
              π
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("cos(")}
            >
              cos
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("log(")}
            >
              log
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("4")}
            >
              4
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("5")}
            >
              5
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("6")}
            >
              6
            </button>

            {/* Row 4 */}
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("e")}
            >
              e
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("tan(")}
            >
              tan
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("√(")}
            >
              √
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("1")}
            >
              1
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("2")}
            >
              2
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("3")}
            >
              3
            </button>

            {/* Row 5 */}
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue(result)}
            >
              Ans
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("exp(")}
            >
              EXP
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("^")}
            >
              x^
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue("0")}
            >
              0
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 rounded py-3 text-lg"
              onClick={() => appendValue(".")}
            >
              .
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white rounded py-3 text-lg"
              onClick={calculate}
            >
              =
            </button>

            {/* Row 6 */}
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded py-3 text-lg"
              onClick={clear}
            >
              AC
            </button>
            <button
              className="bg-yellow-200 hover:bg-yellow-300 rounded py-3 text-lg"
              onClick={() => appendValue("%")}
            >
              %
            </button>
            <button
              className="bg-yellow-200 hover:bg-yellow-300 rounded py-3 text-lg"
              onClick={() => appendValue("/")}
            >
              ÷
            </button>
            <button
              className="bg-yellow-200 hover:bg-yellow-300 rounded py-3 text-lg"
              onClick={() => appendValue("*")}
            >
              ×
            </button>
            <button
              className="bg-yellow-200 hover:bg-yellow-300 rounded py-3 text-lg"
              onClick={() => appendValue("-")}
            >
              -
            </button>
            <button
              className="bg-yellow-200 hover:bg-yellow-300 rounded py-3 text-lg"
              onClick={() => appendValue("+")}
            >
              +
            </button>
          </div>
        </div>

        {/* History section */}
        <div className="p-4 w-full md:w-1/3 bg-white rounded shadow mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Calculation History</h2>
            <button
              onClick={clearHistory}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear
            </button>
          </div>
          <ul className="bg-gray-100 rounded p-3 max-h-64 overflow-y-auto">
            {history.length === 0 && (
              <li className="text-sm text-gray-400">No history yet</li>
            )}
            {history.map((item, index) => (
              <li key={index} className="border-b py-1 text-sm">
                <span className="text-gray-600">{item.expression} = </span>
                <span className="font-semibold">{item.result}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
