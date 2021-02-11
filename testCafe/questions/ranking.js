import {
  frameworks,
  url,
  initSurvey,
  getSurveyResult,
  setData,
} from "../settings";
import { Selector } from "testcafe";
const assert = require("assert");
const title = `rating`;

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "ranking",
          name: "smartphone-features",
          title:
            "Please rank the following smartphone features in order of importance:",
          isRequired: true,
          choices: [
            "Battery life",
            "Screen size",
            "Storage space",
            "Camera quality",
            "Durability",
            "Processor power",
            "Price",
          ],
        },
      ],
    },
    {
      name: "page2",
      elements: [
        {
          type: "checkbox",
          name: "car",
          isRequired: true,
          title: "What cars have you being drived?",
          colCount: 4,
          choicesOrder: "asc",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen",
            "Tesla",
          ],
        },
        {
          type: "ranking",
          name: "bestcar",
          isRequired: true,
          visibleIf: "{car.length} > 1",
          title: "What car did you enjoy the most?",
          choicesFromQuestion: "car",
          choicesFromQuestionMode: "selected",
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test(`ranking: simple using`, async (t) => {
    const PriceItem = Selector(
      "[aria-label='Please rank the following smartphone features in order of importance:']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");

    await t.hover(PriceItem);

    await t.drag(PriceItem, 0, -350, {
      offsetX: 7,
      offsetY: 8,
    });

    let surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult.ranking_question, [
      "Price",
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);
  });

  test(`ranking: predeficed data`, async (t) => {
    const PriceItem = Selector(
      "[aria-label='Please rank the following smartphone features in order of importance:']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");
    let surveyResult = await getSurveyResult();

    await t.debug();
    await setData({
      "smartphone-features": [
        "Price",
        "Battery life",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
      ],
    });
    await t.debug();
    await t.hover(PriceItem);
    await t.debug();
    await t.drag(PriceItem, 0, 50, {
      offsetX: 7,
      offsetY: 8,
    });

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult.ranking_question, [
      "Durability",
      "Battery life",
      "Price",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Processor power",
    ]);

    await setData(null);
    await t.hover(PriceItem);
    await t.drag(PriceItem, 0, -350, {
      offsetX: 7,
      offsetY: 8,
    });

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult.ranking_question, [
      "Price",
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);
  });
});