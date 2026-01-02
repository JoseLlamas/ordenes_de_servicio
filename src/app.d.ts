import type { UsuarioDetalleDTO } from '$lib/types';
import type { defineAbilitiesFor, createValidateAuthorization } from '$lib/server/auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			usuario?: UsuarioDetalleDTO;
			authorize?: ReturnType<typeof createValidateAuthorization>;
		};
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
