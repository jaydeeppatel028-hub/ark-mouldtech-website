import { startTransition, type FormEvent } from "react";

/**
 * React 19 clears a form after its action runs. When the server answers with an
 * error (wrong setup code, upload rejected, rate limit), that would wipe
 * everything the visitor typed. Submitting through this handler runs the same
 * action without the automatic reset. Without JavaScript the form still posts
 * normally through its action attribute.
 */
export function submitKeepingValues(e: FormEvent<HTMLFormElement>, dispatch: (data: FormData) => void) {
  e.preventDefault();
  const submitter = (e.nativeEvent as SubmitEvent).submitter;
  const data = new FormData(e.currentTarget, submitter);
  startTransition(() => dispatch(data));
}
