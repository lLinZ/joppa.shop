// <ai_context>
// Propósito: Página principal de Login de usuarios.
// Responsividad: Ajuste automático mediante el Container de GuestLayout. Campos toman width 100%.
// Dependencias: @inertiajs/react (useForm), @mantine/core (Componentes UI).
// Debugging: Validar rutas post('login') de Laravel Breeze/Jetstream.
// </ai_context>

import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { TextInput, PasswordInput, Checkbox, Button, Group, Anchor, Stack, Text } from '@mantine/core';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <Text c="green" size="sm" fw={500} mb="md">
                    {status}
                </Text>
            )}

            <form onSubmit={submit}>
                <Stack gap="md">
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
                        data-autofocus
                    />

                    <PasswordInput
                        id="password"
                        name="password"
                        label="Password"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        required
                    />

                    <Checkbox
                        name="remember"
                        label="Remember me"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.currentTarget.checked)}
                        color="darkGreen"
                    />

                    <Group justify="space-between" mt="md">
                        {canResetPassword ? (
                            <Anchor component={Link} href={route('password.request')} size="sm" c="dimmed">
                                Forgot your password?
                            </Anchor>
                        ) : (
                            <div />
                        )}

                        <Button type="submit" loading={processing} color="darkGreen" radius="md">
                            Log in
                        </Button>
                    </Group>
                </Stack>
            </form>
        </GuestLayout>
    );
}
