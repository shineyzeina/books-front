import React, { useState, useEffect } from "react";
import authHeader from "../services/auth-header";
import AuthorService from "../services/author.service";
import EventBus from "../common/EventBus";

export const getAuthorLists = async (keyword) => {
  let res = await AuthorService.getAuthorsList(keyword).then(
    (response) => {
      return response.data;
    },
    (error) => {
      const _content =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      alert(_content);

      if (error.response && error.response.status === 401) {
        EventBus.dispatch("logout");

      }
    }
  );
  return res;
}

