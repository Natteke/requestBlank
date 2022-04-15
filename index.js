const { createRequestBlank } = require("./dist/bundle.js");

(async () => {
  const file = await createRequestBlank({
    from: "Владислав",
    to: "Роман",
    type: "Заявление",
    clarification: "Я вот такой ско",
    date: new Date(),
  });

  file.toFile("./testblank.jpeg");
})();
