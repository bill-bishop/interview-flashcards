export type JobListing = {
  id: string;
  title: string;
  company: string;
  sourceType: "paste" | "link";
  sourceValue: string; // pasted text or url
  jdText: string;
  createdAt: string;
};
