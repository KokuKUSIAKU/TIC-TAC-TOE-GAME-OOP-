module.exports = {
  "env": {
      "browser": true,
      "es6": true,
      "node": true,
  },
  "extends": "eslint:recommended",
  "parserOptions": {
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "jsx": true
      },
      "sourceType": "module"
  },
  "plugins": [
      "react"
  ],
  "rules": {
      "indent": [
          "error",
          2,
          { "SwitchCase": 1 }
      ],
      "linebreak-style": [
          "error",
          "windows"
      ],
      "no-console": [
          "warn",
          {
              "allow": [
                  "warn",
                  "error"
              ]
          }
      ],
      "quotes": [
          "error",
          "double"
      ],
      "semi": [
          "error",
          "always"
      ],

      "strict": [
          "error",
          "safe"
      ]
  }
};