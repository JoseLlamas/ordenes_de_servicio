import { fail } from '@sveltejs/kit';

export async function load ({ locals }) {
  return {};
}

export const actions = {

  default: async ({ request }) => {
    const data = await request.formData();
  }

};
