const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__button");
const mainSection = document.querySelector(".main__section");
const user = document.querySelector(".user");
const searchError = document.querySelector(".error");
const githubImage = document.querySelector(".github__image");
const userName = document.querySelector(".user__name");
const userName2 = document.querySelector(".user__name2");
const userBio = document.querySelector(".user__bio");
const userLocation = document.querySelector(".user__location");
const userWebsite = document.querySelector(".user__website");
const firstStatNumber = document.querySelector(".firstStatNumber");
const firstStatTitle = document.querySelector(".firstStatTitle");
const secondStatNumber = document.querySelector(".secondStatNumber");
const secondStatTitle = document.querySelector(".secondStatTitle");
const thirdStatNumber = document.querySelector(".thirdStatNumber");
const thirdStatTitle = document.querySelector(".thirdStatTitle");
const userRepositories = document.querySelector(".user__repositories");

let currentPage = 1;
const fetchUserData = async (userName) => {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}`);
        const data = await response.json();

        if (data.login !== undefined) {
            renderProfile(data);
            renderUserRepositories(userName, currentPage);
        } else {
            userNotFound();
        }
    } catch (error) {
        console.log(error);
    }
};


const renderProfile = (userData) => {
	user.style.display = "flex";
	searchError.style.display = "none";
	githubImage.src = userData.avatar_url;
	userName.textContent = userData.name;
	userName2.textContent = `@${userData.login}`;
	userName2.setAttribute("href", userData.html_url);
	userBio.textContent = userData.bio;

	userLocation.innerHTML = `
        <i class="fa-solid fa-location-dot"></i>
        <p>${userData.location}</p>
    `;

	userWebsite.innerHTML = `
        <i class="fa-solid fa-link"></i>
		<a href="${userData.blog}" class="website__link" target="_blank">${userData.blog}</a>
    `;

	firstStatTitle.textContent = "Followers";
	firstStatNumber.textContent = userData.followers;
	secondStatTitle.textContent = "Following";
	secondStatNumber.textContent = userData.following;
	thirdStatTitle.textContent = "Repositories";
	thirdStatNumber.textContent = userData.public_repos;
};




const userNotFound = () => {
	user.style.display = "none";
	searchError.style.display = "block";
	userRepositories.innerHTML = "";
	userFollowers.innerHTML = "";
};


searchButton.addEventListener("click", () => {
    fetchUserData(searchInput.value);
});

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        fetchUserData(searchInput.value);
    }
});


const renderUserRepositories = async (userName, page) => {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}/repos`);
        const repositories = await response.json();

        const itemsPerPage = 10;
        const totalPages = Math.ceil(repositories.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedRepositories = repositories.slice(startIndex, endIndex);

        let HTMLContentToAppend = "";
        for (const repository of paginatedRepositories) {
            const topics = repository.topics || [];
            const topicHtml = topics.map(topic => `<div class="repository__topics__item">${topic}</div>`).join('');

            HTMLContentToAppend += `
                <div class="repository">
                    <a href="${repository.html_url}" class="repository__name" target="_blank">${repository.name}</a>
                    <div class="repository__info">
                        ${repository.description ? `<p class="repository__description">${repository.description}</p>` : ""}
                        <div class="repository__topics">${topicHtml}</div>
                        <p class="repository__lastUpdate">Last Update: ${String(repository.updated_at).substring(0, 10)}</p>
                    </div>
                </div>
            `;
        }

        userRepositories.innerHTML = `
            ${HTMLContentToAppend}
        `;

        renderPagination(userName, page, totalPages);
    } catch (error) {
        console.log(error);
    }
};

const renderPagination = (userName, currentPage, totalPages) => {
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';

    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.addEventListener('click', () => navigatePage(userName, currentPage - 1));
    previousButton.disabled = currentPage === 1;

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => navigatePage(userName, currentPage + 1));
    nextButton.disabled = currentPage === totalPages;

    paginationContainer.appendChild(previousButton);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => navigatePage(userName, i));

        if (i === currentPage) {
            button.classList.add('active');
        }

        paginationContainer.appendChild(button);
    }

    paginationContainer.appendChild(nextButton);

    userRepositories.appendChild(paginationContainer);
};

const navigatePage = (userName, page) => {
    userRepositories.innerHTML = "";
    currentPage = page;
    renderUserRepositories(userName, page);
};


searchButton.addEventListener("click", () => {
    fetchUserData(searchInput.value);
});

