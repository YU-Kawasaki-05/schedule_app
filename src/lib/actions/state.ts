export type ActionState<T = unknown> = {
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
  ok: boolean;
};

export const initialActionState: ActionState = {
  ok: false
};

export function actionError(error: string): ActionState {
  return {
    error,
    ok: false
  };
}

export function actionSuccess<T>(data?: T): ActionState<T> {
  return {
    data,
    ok: true
  };
}

