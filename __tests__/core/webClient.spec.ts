import "jest";
jest.mock("axios");
import axios from "axios";

import WebClient from "../../src/core/webClient";

describe("WebClient", () => {
  const setGet = data =>
    (axios.get as jest.Mock).mockResolvedValue({ data: data });

  test("get", async () => {
    const sut = new WebClient();
    setGet("hello world");
    const result = await sut.get("http://hello.com");
    expect(result).toBe("hello world");
  });
});
