const urlInput = document.querySelector("#urlInput");
const submitBtn = document.querySelector("#requester .activeBtn");
const notification = document.querySelector("#notification");
const notificationContent = document.querySelector("#notificationContent");

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let value = urlInput.value;
    await fetch("/url", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            url: value
        })
    })
    .then(async (res) => {
        let data = await res.json();
        if(res.status == 400)
        {
            if(data.message)
                alert(data.message);
        }
        else
        {
            notification.classList.remove("invisible");
            notificationContent.textContent = "Link generated: ";
            notificationContent.textContent = notificationContent.textContent + (window.location.href + data.slug);
            setTimeout(() => {
                notification.classList.add("invisible");
            }, 5000);
        }
    })
});