'use strict';

module.exports = {
    app:      'DemoApp',
    version:  '1.0.0',
    platform: 'ANDROID',
    entry:    'Home',
    dev: {
        host    : '0.0.0.0',
        port    : parseInt(process.env.TCP_PORT) || 9091,
        httpPort: parseInt(process.env.PORT) || 5000,
    },
    ui: {
        cdns: [
            'https://cdn.jsdelivr.net/npm/@mui/material@5.0.0/dist/material.min.css',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
            'https://cdn.jsdelivr.net/npm/antd@5.17.0/dist/reset.css'
        ]
    }
};
