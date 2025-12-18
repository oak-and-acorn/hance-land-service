const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("style.css");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("content");

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

  // Load services collection
  eleventyConfig.addGlobalData("services", () => {
    const servicesDir = path.join(__dirname, 'content/services');
    if (!fs.existsSync(servicesDir)) return [];
    
    const files = fs.readdirSync(servicesDir).filter(file => file.endsWith('.json'));
    const services = files.map(file => {
      const content = fs.readFileSync(path.join(servicesDir, file), 'utf8');
      return JSON.parse(content);
    });
    
    return services.sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  // Load portfolio collection
  eleventyConfig.addGlobalData("portfolio", () => {
    const portfolioDir = path.join(__dirname, 'content/portfolio');
    if (!fs.existsSync(portfolioDir)) return [];
    
    const files = fs.readdirSync(portfolioDir).filter(file => file.endsWith('.json'));
    const portfolio = files.map(file => {
      const content = fs.readFileSync(path.join(portfolioDir, file), 'utf8');
      return JSON.parse(content);
    });
    
    return portfolio.sort((a, b) => new Date(b.date) - new Date(a.date));
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
