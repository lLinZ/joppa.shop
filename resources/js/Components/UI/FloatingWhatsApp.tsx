import React from 'react';
import { ActionIcon, Tooltip, rem } from '@mantine/core';
import { IconBrandWhatsapp } from '@tabler/icons-react';

interface FloatingWhatsAppProps {
    phone?: string;
    message?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ 
    phone = '584222030200', 
    message = 'Hola! Me gustaría obtener información sobre sus productos.' 
}) => {
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    return (
        <Tooltip label="Contáctanos por WhatsApp" position="left" withArrow offset={15}>
            <ActionIcon
                component="a"
                href={whatsappUrl}
                target="_blank"
                variant="filled"
                size={60}
                radius="xl"
                bg="#0B3022"
                style={{
                    position: 'fixed',
                    bottom: rem(30),
                    right: rem(30),
                    zIndex: 9999,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                    e.currentTarget.style.backgroundColor = '#0e3d2b';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.backgroundColor = '#0B3022';
                }}
            >
                <IconBrandWhatsapp size={35} stroke={1.5} color="white" />
            </ActionIcon>
        </Tooltip>
    );
};
