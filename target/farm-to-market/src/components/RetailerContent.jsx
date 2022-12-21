import React from "react";
import { Container } from "react-bootstrap";
import { Route, Routes, Navigate } from "react-router-dom";
import routes from "../routes/farmer";

const RetailerContent = () => {
  return (
    <Container>
      <Routes>
        {routes.map((route, idx) => {
          return (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                element={<route.element />}
              />
            )
          );
        })}
        <Route path="/admin" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Container>
  );
};

export default RetailerContent;
