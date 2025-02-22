const AIRTABLE_API_KEY = "your_airtable_api_key";  // Replace with your Airtable API Key
const BASE_ID = "appopz4GXqkTszuJ7";  // Replace with your Airtable Base ID
const TABLE_NAME = "Ideas";  // Replace with your Airtable table name

// Function to generate unique project idea groups
function generateUniqueGroups(emails, minGroupSize = 3, maxGroupSize = 5, numGroups = 25) {
    if (emails.length < minGroupSize) {
        console.log("Not enough emails to form a valid group.");
        return [];
    }

    let groups = new Set();
    let attempts = 0;
    const maxAttempts = 1000;  // Prevent infinite loops

    while (groups.size < numGroups && attempts < maxAttempts) {
        let groupSize = Math.floor(Math.random() * (maxGroupSize - minGroupSize + 1)) + minGroupSize;
        let shuffledEmails = emails.slice().sort(() => 0.5 - Math.random()); // Shuffle emails
        let newGroup = shuffledEmails.slice(0, groupSize).sort(); // Select a subset and sort

        let groupKey = newGroup.join(","); // Unique key to prevent duplicates
        if (!groups.has(groupKey)) {
            groups.add(groupKey);
        }

        attempts++;
    }

    return Array.from(groups).map(group => group.split(","));
}

// Function to upload generated groups to Airtable
async function uploadToAirtable(groups) {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];

        let data = {
            records: [
                {
                    fields: {
                        "Group Name": `Team ${i + 1}`,
                        "Emails": group.join(", "),
                        "Idea Title": `Project Idea ${i + 1}`,
                        "Description": `Idea submitted by ${group.join(", ")}`
                    }
                }
            ]
        };

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            let result = await response.json();
            console.log(`✅ Group ${i + 1} uploaded successfully:`, result);
        } catch (error) {
            console.error(`❌ Error uploading group ${i + 1}:`, error);
        }
    }
}

// Example email list
let emailList = [
    "student1@college.edu", "student2@college.edu", "student3@college.edu",
    "student4@college.edu", "student5@college.edu", "student6@college.edu",
    "student7@college.edu", "student8@college.edu", "student9@college.edu",
    "student10@college.edu"
];

// Generate groups and upload them
let ideaSubmissionGroups = generateUniqueGroups(emailList, 3, 5, 25);
uploadToAirtable(ideaSubmissionGroups);
