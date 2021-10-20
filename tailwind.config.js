module.exports = {
    purge: [
      "./client/*.css",
      "./client/*.js",
      "./client/*.html"
    ],
    darkMode: false, 
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/custom-forms'),
    ]
  
  }
