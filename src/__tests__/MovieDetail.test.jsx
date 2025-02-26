import { render, fireEvent, waitFor } from "@testing-library/react";
import MovieDetail from "../pages/MovieDetail"; // Adjusted path
import { MemoryRouter } from "react-router-dom";
import api from "../services/api";

jest.mock("../services/api");

test("rates movie and prevents re-rating", async () => {
  api.get.mockImplementation((url) => {
    if (url === "/api/movies/157336/") return Promise.resolve({ data: { tmdb_id: 157336, title: "Interstellar", user_rating: null } });
    if (url === "/api/collection/") return Promise.resolve({ data: [] });
    return Promise.resolve({ data: { results: [] } });
  });
  api.put.mockResolvedValueOnce({ data: { rating: 3 } });

  const { getAllByRole } = render(
    <MemoryRouter initialEntries={["/movies/157336"]}>
      <MovieDetail />
    </MemoryRouter>
  );

  const stars = getAllByRole("img", { name: /star/i });
  fireEvent.click(stars[2]);
  await waitFor(() => expect(api.put).toHaveBeenCalledWith("/api/movies/157336/rate/", { rating: 3 }, expect.any(Object)));
  expect(stars[2]).toHaveClass("solid");
  fireEvent.click(stars[3]);
  expect(api.put).toHaveBeenCalledTimes(1);
});