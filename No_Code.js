{
  components: [
    {
      type: "IfComponent",
      settings: {
        test: {
          type: "CallExpression",
          method: "isNewcomer",
          parameters: [],
        },
        consequent: {
          type: "TextComponent",
          settings: {
            text: "Welcome! Click a button below to sign up.",
          },
        },
        alternate: {
          type: "TextComponent",
          settings: {
            text: "Welcome back!",
          },
        },
      },
    },
  ];
}

// becomes:

let [a, b] = [isNewcomer, TextComponent];

a()
  ? [b({ a: "Welcome! Click a button below to sign up." })]
  : [b({ a: "Welcome back!" })];
