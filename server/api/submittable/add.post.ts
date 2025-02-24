export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  // Get the runtimeconfig SUBMITTABLE API KEY
  const SUBMITTABLE_API_KEY = useRuntimeConfig().SUBMITTABLE_API_KEY;

  // Update a result
  try {
    const labelId = "74014b95-b192-4fc0-8d1b-086ae9a77dd3";
    const response = await $fetch(
      `https://submittable-api.submittable.com/v4/submissions/${body.submissionId}/labels/${labelId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${SUBMITTABLE_API_KEY}`,
        },
        simple: true,
      }
    );
    return { message: "Exam Taken label properly applied" };
  } catch (error: any) {
    console.log(`${error.status} - ${error.data.messages[0]}`);
    return { message: `${error.status} - ${error.data.messages[0]}` };
  }
});
