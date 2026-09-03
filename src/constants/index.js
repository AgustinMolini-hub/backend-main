export const ROLES = Object.freeze({
    ADMIN: 'ADMIN',
    USER: 'USER',
    DRIVER: 'DRIVER'
});


export const ORDER_STATUS = Object.freeze({
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
});


export const ORDER_PRIORITY = Object.freeze({
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
});


export const PRODUCT_STATUS = Object.freeze({
    AVAILABLE: 'AVAILABLE',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    DISCONTINUED: 'DISCONTINUED'
});


export const DELIVERY_STATUS = Object.freeze({
    PENDING: 'PENDING',
    ASSIGNED: 'ASSIGNED',
    IN_TRANSIT: 'IN_TRANSIT',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
});


/**
 * Tipos de documentos aceptados para usuarios.
 *
 * Se centralizan en constantes para evitar
 * strings literales repetidos en modelos,
 * servicios y controladores.
 */
export const DOCUMENT_TYPES = Object.freeze({
    DNI: 'DNI',
    LICENSE: 'LICENSE',
    OTHER: 'OTHER'
});