const { createRequestBlank } = require("./dist/bundle.js");

(async () => {
  const file = await createRequestBlank({
    from: "test",
    to: "test",
    type: "test",
    clarification: "test",
    date: new Date(),
    withRespect: 'С Уважением Андрей викторович'
  });

  file.toFile("./testblank.jpeg");
})();
