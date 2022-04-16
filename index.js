const { createRequestBlank } = require("./dist/bundle.js");

(async () => {
  const file = await createRequestBlank({
    from: "test",
    to: "test",
    type: "test",
    clarification: "Уважаемый Роман, прошу вас присоедениться к сегодняшней игре в Dota 2 на роли поддержка",
    date: new Date(),
    withRespect: 'С Уважением,,,, Андрей викторович'
  });

  file.toFile("./testblank.jpeg");
})();
