export default async function fetchCustomers() {
  console.log("API Endpoint:", process.env.NEXT_PUBLIC_API_ENDPOINT); 
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_ENDPOINT + "/allcustomers",
    {
      cache: "no-cache",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch customers");
  }
  return res.json();
}
