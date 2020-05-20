import {workspace, window, ViewColumn} from 'vscode';

export const sumT
    = (...a: number[]) =>
      a.reduce((acc, val) => acc + val, 0);