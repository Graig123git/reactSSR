import axios from "axios";

export async function fetchPopularRepos(language = "all") {
    try {
        const response = await axios.get(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`)
        return response.data.items
    } catch (error) {
        console.log("error",error);
        return null;
    }
}