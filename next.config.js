module.exports = {
    images: {
      remotePatterns: [
        {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
        },
      ],
    },
    reactStrictMode: false,
    compiler: {
      // Enables the styled-components SWC transform
      styledComponents: true
    }
}