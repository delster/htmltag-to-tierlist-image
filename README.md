# HTML Tags to Tier List Items

Generates images of html tags on backgrounds by category. The category -> color map determines the background color, the font size is dynamically scaled to fit the 512x512 png recommended by [Tier Maker](https://tiermaker.com/), and the tag name is wrapped in `<>` brackets. Run `node generate-images.js` in the root; output will be in `/output`.

## Why?

I'm going to make tier list video for HTML tags, this is my way over over-engineering it. It was vibe coded quickly; if I revisit this I'll reshape the data like:

```js
[
  {
    category: "cat1",
    color: "#ffffff",
    tags: ["a", "abbr"],
  },
  {
    category: "cat2",
    color: "#000000",
    tags: ["acronym", "address"],
  },
  ...
];
```

I can think of other improvements, but there's no return for one-use hacks like this.
