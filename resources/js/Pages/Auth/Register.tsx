// <ai_context>
// Propósito: Página de Registro de nuevos usuarios.
// Responsividad: Formularios al 100% de ancho del Paper responsivo del GuestLayout.
// Dependencias: @inertiajs/react (useForm), @mantine/core.
// Debugging: Revisar confirmación de contraseñas.
// </ai_context>

import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextInput, PasswordInput, Button, Group, Anchor, Stack } from '@mantine/core';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <Stack gap="md">
                    <TextInput
                        id="name"
                        name="name"
                        label="Name"
                        value={data.name}
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                        required
                        data-autofocus
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        label="Email"
                        value={data.email}
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                        required
                    />

                    <PasswordInput
                        id="password"
                        name="password"
                        label="Password"
                        value={data.password}
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        required
                    />

                    <PasswordInput
                        id="password_confirmation"
                        name="password_confirmation"
                        label="Confirm Password"
                        value={data.password_confirmation}
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                        required
                    />

                    <Group justify="space-between" mt="md">
                        <Anchor component={Link} href={route('login')} size="sm" c="dimmed">
                            Already registered?
                        </Anchor>

                        <Button type="submit" loading={processing} color="darkGreen" radius="md">
                            Register
                        </Button>
                    </Group>
                </Stack>
            </form>
        </GuestLayout>
    );
}
