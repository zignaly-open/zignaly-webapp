/**
 * Transform user create response to typed object.
 *
 * @export
 * @param {*} response
 * @returns {UserCreateResponse}
 */
export function userCreateResponseTransform(response) {
  const transformResponse = {}
  transformResponse.token = response

  return transformResponse
}
