module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("admin");

  // Add JSON data global filter
  eleventyConfig.addGlobalData("hero", () => {
    return require("./content/hero.json");
  });
  
  eleventyConfig.addGlobalData("about", () => {
    return require("./content/about.json");
  });
  
  eleventyConfig.addGlobalData("contact", () => {
    return require("./content/contact.json");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk"
  };
};
