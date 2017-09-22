export function formatHTTPError(err: any) {
  console.log(err);
  if (!err) return 'no error data';
  return err.error || (err.text ? err.text() : null) || `${err}`;
}
