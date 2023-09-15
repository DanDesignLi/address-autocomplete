import commonjs from "@rollup/plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "rollup-plugin-typescript2";
import packageJson from "./package.json";
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
    input: "./src/index.ts",
    output: [
        {
            file: packageJson.json,
            format: "cjs",
            sourcemap: false
        },
    ],
    plugins: [peerDepsExternal(), nodeResolve(), commonjs(), typescript()]
};