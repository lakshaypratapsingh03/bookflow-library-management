import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:4000/api/v1/auth";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    message: null,
    user: null,
    isAuthenticated: false,
    requiresFaceVerification: false,
    faceChallengeToken: null,
  },
  reducers: {
    registerRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    registerFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    otpVerificationRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    otpVerificationSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.requiresFaceVerification = false;
      state.faceChallengeToken = null;
    },
    otpVerificationFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    loginRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
      state.requiresFaceVerification = false;
      state.faceChallengeToken = null;
      try {
        sessionStorage.removeItem("faceChallengeToken");
      } catch {
        // Ignore storage errors.
      }
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.requiresFaceVerification = false;
      state.faceChallengeToken = null;
    },
    loginFaceChallenge(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.requiresFaceVerification = true;
      state.faceChallengeToken = action.payload.faceChallengeToken;
      state.isAuthenticated = false;
      state.user = null;
      try {
        sessionStorage.setItem(
          "faceChallengeToken",
          action.payload.faceChallengeToken
        );
      } catch {
        // Ignore storage errors.
      }
    },
    loginFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.requiresFaceVerification = false;
      state.faceChallengeToken = null;
    },
    verifyFaceRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    verifyFaceSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.requiresFaceVerification = false;
      state.faceChallengeToken = null;
      try {
        sessionStorage.removeItem("faceChallengeToken");
      } catch {
        // Ignore storage errors.
      }
    },
    verifyFaceFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearFaceChallenge(state) {
      state.requiresFaceVerification = false;
      state.faceChallengeToken = null;
      state.error = null;
      state.message = null;
      try {
        sessionStorage.removeItem("faceChallengeToken");
      } catch {
        // Ignore storage errors.
      }
    },
    restoreFaceChallenge(state, action) {
      state.requiresFaceVerification = true;
      state.faceChallengeToken = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },
    enrollFaceRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    enrollFaceSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      if (state.user) {
        state.user.faceEnabled = true;
      }
    },
    enrollFaceFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    disableFaceRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    disableFaceSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      if (state.user) {
        state.user.faceEnabled = false;
      }
    },
    disableFaceFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logoutRequest(state) {
      state.loading = true;
      state.message = null;
      state.error = null;
    },
    logoutSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.requiresFaceVerification = false;
      state.faceChallengeToken = null;
      try {
        sessionStorage.removeItem("faceChallengeToken");
      } catch {
        // Ignore storage errors.
      }
    },
    logoutFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    getUserRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    getUserSuccess(state, action) {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    getUserFailed(state) {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    },
    forgotPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
    },
    forgotPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    resetPasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    updateSemesterRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateSemesterSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
    updateSemesterFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthSlice(state) {
      state.error = null;
      state.loading = false;
      state.message = null;
    },
  },
});

export const resetAuthSlice = () => (dispatch) => {
  dispatch(authSlice.actions.resetAuthSlice());
};

export const clearFaceChallenge = () => (dispatch) => {
  dispatch(authSlice.actions.clearFaceChallenge());
};

export const restoreFaceChallenge = () => (dispatch) => {
  try {
    const token = sessionStorage.getItem("faceChallengeToken");
    if (token) {
      dispatch(authSlice.actions.restoreFaceChallenge(token));
    }
  } catch {
    // Ignore storage errors.
  }
};

export const register = (data) => async (dispatch) => {
  dispatch(authSlice.actions.registerRequest());
  await axios
    .post(`${API_BASE}/register`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(authSlice.actions.registerSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.registerFailed(error.response.data.message)
      );
    });
};

export const otpVerification = (email, otp) => async (dispatch) => {
  dispatch(authSlice.actions.otpVerificationRequest());
  await axios
    .post(
      `${API_BASE}/verify-otp`,
      { email, otp },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      dispatch(authSlice.actions.otpVerificationSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.otpVerificationFailed(error.response.data.message)
      );
    });
};

export const login = (data) => async (dispatch) => {
  dispatch(authSlice.actions.loginRequest());
  await axios
    .post(`${API_BASE}/login`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(authSlice.actions.loginSuccess(res.data));
    })
    .catch((error) => {
      dispatch(authSlice.actions.loginFailed(error.response.data.message));
    });
};

export const faceOnlyLogin = (email, descriptor) => async (dispatch) => {
  dispatch(authSlice.actions.verifyFaceRequest());
  await axios
    .post(
      `${API_BASE}/face/login`,
      { email, descriptor },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      dispatch(authSlice.actions.verifyFaceSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.verifyFaceFailed(error.response.data.message)
      );
    });
};

export const enrollFace = (descriptor) => async (dispatch) => {
  dispatch(authSlice.actions.enrollFaceRequest());
  try {
    const res = await axios.post(
      `${API_BASE}/face/enroll`,
      { descriptor },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(authSlice.actions.enrollFaceSuccess(res.data));
    dispatch(getUser());
  } catch (error) {
    dispatch(
      authSlice.actions.enrollFaceFailed(error.response.data.message)
    );
  }
};

export const disableFace = () => async (dispatch) => {
  dispatch(authSlice.actions.disableFaceRequest());
  try {
    const res = await axios.delete(`${API_BASE}/face`, {
      withCredentials: true,
    });
    dispatch(authSlice.actions.disableFaceSuccess(res.data));
    dispatch(getUser());
  } catch (error) {
    dispatch(
      authSlice.actions.disableFaceFailed(error.response.data.message)
    );
  }
};

export const logout = () => async (dispatch) => {
  dispatch(authSlice.actions.logoutRequest());
  await axios
    .get(`${API_BASE}/logout`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(authSlice.actions.logoutSuccess(res.data.message));
      dispatch(authSlice.actions.resetAuthSlice());
    })
    .catch((error) => {
      dispatch(authSlice.actions.logoutFailed(error.response.data.message));
    });
};

export const getUser = () => async (dispatch) => {
  dispatch(authSlice.actions.getUserRequest());
  await axios
    .get(`${API_BASE}/me`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(authSlice.actions.getUserSuccess(res.data));
    })
    .catch(() => {
      dispatch(authSlice.actions.getUserFailed());
    });
};

export const forgotPassword = (email) => async (dispatch) => {
  dispatch(authSlice.actions.forgotPasswordRequest());
  await axios
    .post(
      `${API_BASE}/password/forgot`,
      { email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      dispatch(authSlice.actions.forgotPasswordSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.forgotPasswordFailed(error.response.data.message)
      );
    });
};

export const resetPassword = (token, data) => async (dispatch) => {
  dispatch(authSlice.actions.resetPasswordRequest());
  await axios
    .put(`${API_BASE}/password/reset/${token}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(authSlice.actions.resetPasswordSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.resetPasswordFailed(error.response.data.message)
      );
    });
};

export const updatePassword = (data) => async (dispatch) => {
  dispatch(authSlice.actions.updatePasswordRequest());
  await axios
    .put(`${API_BASE}/password/update`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
    })
    .catch((error) => {
      dispatch(
        authSlice.actions.updatePasswordFailed(error.response.data.message)
      );
    });
};

export const updateSemester = (course, semester) => async (dispatch) => {
  dispatch(authSlice.actions.updateSemesterRequest());
  try {
    const res = await axios.put(
      `${API_BASE}/semester/update`,
      { course, semester },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(authSlice.actions.updateSemesterSuccess(res.data));
  } catch (error) {
    dispatch(
      authSlice.actions.updateSemesterFailed(error.response.data.message)
    );
  }
};

export default authSlice.reducer;
