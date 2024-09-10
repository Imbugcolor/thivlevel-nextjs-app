module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'res.cloudinary.com',
          port: '',
        },
        {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
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