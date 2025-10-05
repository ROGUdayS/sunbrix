/**
 * Test script to verify alt tags are working in both static and API modes
 * This script tests the sunr-next-app application
 */

const https = require("https");
const http = require("http");

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
const API_BASE_URL = process.env.API_BASE_URL;

// Test results
const results = {
  static: { passed: 0, failed: 0, tests: [] },
  api: { passed: 0, failed: 0, tests: [] },
};

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;

    client
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      })
      .on("error", reject);
  });
}

// Test function to check for alt attributes in HTML
function checkAltTags(html, testName) {
  const results = [];

  // Check for img tags with alt attributes
  const imgTagRegex = /<img[^>]*>/gi;
  const imgTags = html.match(imgTagRegex) || [];

  imgTags.forEach((imgTag, index) => {
    const hasAlt = imgTag.includes("alt=");
    const altValue = imgTag.match(/alt=["']([^"']*)["']/i);

    if (!hasAlt) {
      results.push({
        type: "error",
        message: `Image ${index + 1} missing alt attribute: ${imgTag}`,
      });
    } else if (altValue && altValue[1].trim() === "") {
      results.push({
        type: "error",
        message: `Image ${index + 1} has empty alt attribute: ${imgTag}`,
      });
    } else if (altValue && altValue[1].trim().length > 0) {
      results.push({
        type: "success",
        message: `Image ${index + 1} has valid alt text: "${altValue[1]}"`,
      });
    }
  });

  return {
    testName,
    totalImages: imgTags.length,
    results,
  };
}

// Test static pages
async function testStaticPages() {
  console.log("Testing static pages for alt tags...\n");

  const pages = [
    { name: "Home Page", url: `${BASE_URL}/` },
    { name: "Projects Page", url: `${BASE_URL}/projects` },
    { name: "About Page", url: `${BASE_URL}/about` },
    { name: "Contact Page", url: `${BASE_URL}/contact` },
    { name: "Blogs Page", url: `${BASE_URL}/blogs` },
    { name: "FAQ Page", url: `${BASE_URL}/faq` },
    { name: "Testimonials Page", url: `${BASE_URL}/testimonials` },
  ];

  for (const page of pages) {
    try {
      console.log(`Testing ${page.name}...`);
      const response = await makeRequest(page.url);

      if (response.statusCode === 200) {
        const altTest = checkAltTags(response.body, page.name);
        results.static.tests.push(altTest);

        const errors = altTest.results.filter((r) => r.type === "error");
        const successes = altTest.results.filter((r) => r.type === "success");

        if (errors.length === 0) {
          console.log(
            `  ${page.name}: ${successes.length} images with valid alt tags`
          );
          results.static.passed++;
        } else {
          console.log(
            `  ${page.name}: ${errors.length} images with missing/invalid alt tags`
          );
          errors.forEach((error) => console.log(`    - ${error.message}`));
          results.static.failed++;
        }
      } else {
        console.log(`  ${page.name}: HTTP ${response.statusCode}`);
        results.static.failed++;
      }
    } catch (error) {
      console.log(`  ${page.name}: Error - ${error.message}`);
      results.static.failed++;
    }
  }
}

// Test API endpoints
async function testApiEndpoints() {
  console.log("\nTesting API endpoints for alt tags...\n");

  const endpoints = [
    { name: "Projects API", url: `${API_BASE_URL}/projects` },
    { name: "Gallery API", url: `${API_BASE_URL}/content/gallery` },
    { name: "Blogs API", url: `${API_BASE_URL}/content/blogs` },
    { name: "Testimonials API", url: `${API_BASE_URL}/content/testimonials` },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await makeRequest(endpoint.url);

      if (response.statusCode === 200) {
        const data = JSON.parse(response.body);
        const altTest = checkApiDataForAltTags(data, endpoint.name);
        results.api.tests.push(altTest);

        const errors = altTest.results.filter((r) => r.type === "error");
        const successes = altTest.results.filter((r) => r.type === "success");

        if (errors.length === 0) {
          console.log(`  ${endpoint.name}: All images have alt text`);
          results.api.passed++;
        } else {
          console.log(
            `  ${endpoint.name}: ${errors.length} images missing alt text`
          );
          errors.forEach((error) => console.log(`    - ${error.message}`));
          results.api.failed++;
        }
      } else {
        console.log(`  ${endpoint.name}: HTTP ${response.statusCode}`);
        results.api.failed++;
      }
    } catch (error) {
      console.log(`  ${endpoint.name}: Error - ${error.message}`);
      results.api.failed++;
    }
  }
}

// Check API data for alt text fields
function checkApiDataForAltTags(data, testName) {
  const results = [];

  // Check if data is an array or single object
  const items = Array.isArray(data) ? data : [data];

  items.forEach((item, itemIndex) => {
    // Check for images array with alt_texts
    if (item.images && Array.isArray(item.images)) {
      if (item.image_alt_texts && Array.isArray(item.image_alt_texts)) {
        if (item.images.length === item.image_alt_texts.length) {
          results.push({
            type: "success",
            message: `Item ${itemIndex + 1}: All ${
              item.images.length
            } images have alt text`,
          });
        } else {
          results.push({
            type: "error",
            message: `Item ${itemIndex + 1}: Mismatch between images (${
              item.images.length
            }) and alt texts (${item.image_alt_texts.length})`,
          });
        }
      } else {
        results.push({
          type: "error",
          message: `Item ${itemIndex + 1}: Missing image_alt_texts array`,
        });
      }
    }

    // Check for single image with alt_text
    if (item.image_url && !item.alt_text) {
      results.push({
        type: "error",
        message: `Item ${itemIndex + 1}: Image has no alt_text field`,
      });
    } else if (item.image_url && item.alt_text) {
      results.push({
        type: "success",
        message: `Item ${itemIndex + 1}: Image has alt text: "${
          item.alt_text
        }"`,
      });
    }

    // Check for featured_image with alt text
    if (item.featured_image && !item.featured_image_alt_text) {
      results.push({
        type: "error",
        message: `Item ${itemIndex + 1}: Featured image has no alt text`,
      });
    } else if (item.featured_image && item.featured_image_alt_text) {
      results.push({
        type: "success",
        message: `Item ${itemIndex + 1}: Featured image has alt text: "${
          item.featured_image_alt_text
        }"`,
      });
    }
  });

  return {
    testName,
    totalItems: items.length,
    results,
  };
}

// Generate test report
function generateReport() {
  console.log("\nTest Report");
  console.log("=".repeat(50));

  console.log("\nStatic Pages:");
  console.log(`  Passed: ${results.static.passed}`);
  console.log(`  Failed: ${results.static.failed}`);
  console.log(` Total: ${results.static.passed + results.static.failed}`);

  console.log("\n API Endpoints:");
  console.log(`  Passed: ${results.api.passed}`);
  console.log(`  Failed: ${results.api.failed}`);
  console.log(` Total: ${results.api.passed + results.api.failed}`);

  const totalPassed = results.static.passed + results.api.passed;
  const totalFailed = results.static.failed + results.api.failed;
  const totalTests = totalPassed + totalFailed;

  console.log("\nOverall Results:");
  console.log(`  Passed: ${totalPassed}`);
  console.log(`  Failed: ${totalFailed}`);
  console.log(
    ` Success Rate: ${
      totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0
    }%`
  );

  if (totalFailed === 0) {
    console.log("\nAll tests passed! Alt tags are properly implemented.");
  } else {
    console.log("\n Some tests failed. Please check the issues above.");
  }
}

// Main test function
async function runTests() {
  console.log("Starting Alt Tag Tests for sunr-next-app");
  console.log("=".repeat(50));

  try {
    await testStaticPages();
    await testApiEndpoints();
    generateReport();
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  }
}

// Run tests
runTests();
