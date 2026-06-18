export function generateSmartTags(filename = "") {
  const tags = [];

  const lower = filename.toLowerCase();

  if (
    lower.includes("passport") ||
    lower.includes("id") ||
    lower.includes("visa")
  ) {
    tags.push("passport-photo");
  }

  if (
    lower.includes("portrait") ||
    lower.includes("profile")
  ) {
    tags.push("portrait");
  }

  if (
    lower.includes("white")
  ) {
    tags.push("white-background");
  }

  if (
    lower.includes("formal")
  ) {
    tags.push("formal");
  }

  if (
    lower.includes("studio")
  ) {
    tags.push("studio-lighting");
  }

  if (tags.length === 0) {
    tags.push("processed-photo");
    tags.push("ai-enhanced");
  }

  return tags;
}