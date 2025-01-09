import "./style.css";
const testUrl = "https://owen-wilson-wow-api.onrender.com/wows/random?movie=";
const allmovies = "https://owen-wilson-wow-api.onrender.com/wows/movies";

const p = document.querySelector<HTMLParagraphElement>("p");
const ol = document.querySelector<HTMLOListElement>("ol");
const section = document.querySelector<HTMLElement>("section");
const inp = document.querySelector<HTMLInputElement>("input");
const btn = document.querySelector<HTMLButtonElement>("button");

if (!p || !ol || !section || !inp || !btn) {
  throw new Error("Nödvändiga DOM-element kunde inte hittas.");
}

// Typ för API-svar
interface MovieData {
  movie: string;
  video: { [key: string]: string };
}

// Funktion för att hämta en specifik film
const getApi = async (moviesName: string): Promise<MovieData[]> => {
  try {
    const response = await fetch(testUrl + moviesName);
    if (!response.ok) {
      throw new Error(`API-svar fel: ${response.status}`);
    }

    const data: MovieData[] = await response.json();
    data.forEach((get) => {
      const span = document.createElement("span");
      span.textContent = get.movie;
      p?.appendChild(span);
    });

    return data;
  } catch (error) {
    console.error("Fel vid hämtning av data:", error);
    throw error;
  }
};

// Funktion för att hämta alla filmer
const getAllMovies = async (): Promise<string[]> => {
  try {
    const response = await fetch(allmovies);
    if (!response.ok) {
      throw new Error(`API-svar fel: ${response.status}`);
    }

    const data: string[] = await response.json();
    data.forEach((get) => {
      const li = document.createElement("li");
      li.textContent = get;
      ol?.appendChild(li);
    });

    return data;
  } catch (error) {
    console.error("Fel vid hämtning av alla filmer:", error);
    throw error;
  }
};

// Initiera hämtning av alla filmer
getAllMovies();

// Lyssnare för klick på knappen
btn.addEventListener("click", async () => {
  if (!inp || !section || !p) return;

  section.innerHTML = "";
  p.innerHTML = "";

  const movieName = inp.value.trim();

  if (movieName === "") {
    p.innerHTML = "Du måste skriva in ett filnamn!";
    return;
  }

  try {
    const data = await getApi(movieName);

    if (data.length === 0) {
      p.innerHTML = "Inga resultat hittades för den filmen.";
    } else {
      data.forEach((get) => {
        if (get.video && get.video["360p"]) {
          const showVideo = document.createElement("video");
          showVideo.src = get.video["360p"];
          showVideo.controls = true;
          showVideo.autoplay = true;
          section.appendChild(showVideo);
        } else {
          console.warn("Ingen video hittades för filmen:", get.movie);
        }
      });
    }
  } catch (error) {
    console.error("Ett fel inträffade vid hämtning:", error);
    p.innerHTML = "Ett fel inträffade. Försök igen senare.";
  }

  inp.value = "";
});
