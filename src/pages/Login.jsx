import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import GithubBtn from "../components/GithubBtn";
import { setCookieToken } from "../cookie/cookie";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
import {
  postLoginQueryFindUserPassword,
  postLoginUseQueryUserInfo,
} from "../apis/queries/loginQuery";
import LoadingSpinner from "../components/loading/LoadingSpinner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: postLoginInfo } = useMutation(
    () => postLoginUseQueryUserInfo(userLoginInfo),
    {
      onSuccess: (res) => {
        console.log(res);
        setCookieToken("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        setIsLoading(true);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const { mutate: loginFindUserPassword } = useMutation(
    (email) => postLoginQueryFindUserPassword(email),
    {
      onSuccess: (res) => {
        console.log(res);
      },
      onError: () => {},
    }
  );

  const userLoginInfo = { email, password };

  const idOnChange = (e) => {
    setEmail(e.target.value);
    const regEmail =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const userEmailCurrent = e.target.value;
    setEmail(e.target.value);

    if (!regEmail.test(userEmailCurrent)) {
      setEmailMessage("이메일 형식이 올바르지 않습니다.");
      setIsEmail(false);
    } else {
      setEmailMessage("");
      setIsEmail(true);
    }
  };
  const pwOnChange = (e) => {
    setPassword(e.target.value);
    const regPassword = /(?=.*\d)(?=.*[a-zA-ZS]).{8,16}/;
    const userPasswordCurrent = e.target.value;

    if (!regPassword.test(userPasswordCurrent)) {
      setPasswordMessage("영어, 숫자, 특수문자 조합해서 입력해주세요 (8~16자)");
      setIsPassword(false);
    } else {
      setPasswordMessage("");
      setIsPassword(true);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    postLoginInfo();
  };

  const onClickFindPw = (e) => {
    e.preventDefault();
    Swal.fire({
      text: "비밀번호 찾을 이메일을 입력해주세요",
      input: "text",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "돌아가기",
      preConfirm: (email) => {
        loginFindUserPassword(email);
      },
    });
  };

  return (
    <LoginContainer>
      {isLoading === true ? (
        <LoadingSpinner />
      ) : (
        <LoginFormWrapper>
          <LoginTitleListWrapper>
            <LoginTitleWrapper>
              <MainTitle>Login</MainTitle>
            </LoginTitleWrapper>
          </LoginTitleListWrapper>
          <LoginForm>
            <LoginFormInnerWrapper>
              <IdContainer>
                <p>이메일</p>
                {email.length > 0 ? (
                  <>
                    <IdInput
                      value={email}
                      onChange={idOnChange}
                      placeholder="이메일을 입력해주세요"
                    />
                    <InputMessage>{emailMessage}</InputMessage>
                  </>
                ) : (
                  <>
                    <IdInput
                      value={email}
                      onChange={idOnChange}
                      placeholder="이메일을 입력해주세요"
                    />
                  </>
                )}
              </IdContainer>
              <PwContainer>
                <p>비밀번호</p>
                {password.length > 0 ? (
                  <>
                    <PwInput
                      type={"password"}
                      value={password}
                      onChange={pwOnChange}
                      placeholder="비밀번호를 입력해주세요"
                    />
                    <InputMessage>{passwordMessage}</InputMessage>
                  </>
                ) : (
                  <>
                    <PwInput
                      type={"password"}
                      value={password}
                      onChange={pwOnChange}
                      placeholder="비밀번호를 입력해주세요"
                    />
                  </>
                )}
              </PwContainer>
              {isEmail && isPassword ? (
                <LoginBtn
                  style={{
                    backgroundColor: "#738598",
                    color: "white",
                    border: "none",
                  }}
                  onClick={onSubmit}
                  type="submit"
                >
                  로그인
                </LoginBtn>
              ) : (
                <LoginBtn style={{ pointerEvents: "none" }} onClick={onSubmit}>
                  로그인
                </LoginBtn>
              )}

              <GithubBtn />
              <MenuList>
                {/* <MenuItem>
                <Link to="/findid">아이디 찾기</Link>
              </MenuItem> */}
                <MenuItem>
                  <FindPwContainer onClick={onClickFindPw}>
                    비밀번호 찾기
                  </FindPwContainer>
                </MenuItem>
              </MenuList>
              <RegisterMoveBtn>
                <Link className="signupButton" to="/signup">
                  가입이 아직이신가요?
                </Link>
              </RegisterMoveBtn>
            </LoginFormInnerWrapper>
          </LoginForm>
        </LoginFormWrapper>
      )}
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 350px;
  height: 90vh;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.subBackgroundColor};
  a {
    color: ${({ theme }) => theme.colors.white};
  }
`;

const LoginFormWrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
`;

const LoginTitleListWrapper = styled.div`
  width: 40%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;
const LoginTitleWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 100px;
  background-color: ${({ theme }) => theme.colors.subColor3};
  color: white;
`;
const MainTitle = styled.span`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.titleSize};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 10px;
`;

const LoginForm = styled.form`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.subColor3};
  padding: 40px 100px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginFormInnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoginBtn = styled.button`
  display: block;
  margin: 15px 0;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  background-color: transparent;
  transition: all 0.5s;
  cursor: pointer;
`;

const IdContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 10px 0;
  position: relative;
  height: 100px;
  color: ${({ theme }) => theme.colors.white};

  p {
    margin-bottom: 10px;
    font-size: ${({ theme }) => theme.fontSizes.base};
    span {
      font-size: ${({ theme }) => theme.fontSizes.small};
    }
  }
`;
const IdInput = styled.input`
  padding: 5px;
  width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};

  font-size: ${({ theme }) => theme.fontSizes.base};
  &::placeholder {
    color: ${({ theme }) => theme.colors.subColor4};
  }
`;

const PwContainer = styled(IdContainer)``;
const PwInput = styled(IdInput)``;

const MenuList = styled.ul`
  display: flex;
  justify-content: space-evenly;
  margin: 0;
  padding: 20px 0;
  list-style: none;
`;
const MenuItem = styled.li`
  a {
    &:hover {
      font-weight: bold;
      text-decoration: underline;
    }
  }
`;

const RegisterMoveBtn = styled.div`
  margin-top: 20px;
  width: 490px;
  a {
    border-bottom: 1px solid white;
    padding-bottom: 2px;
    &:hover {
      font-weight: bold;
    }
  }
`;

const InputMessage = styled.div`
  display: block;
  position: absolute;
  color: ${({ theme }) => theme.colors.subColor2};
  line-height: 16px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  bottom: 0;
`;

const FindPwContainer = styled.button`
  border-bottom: 1px solid white;
  border-top: none;
  border-left: none;
  border-right: none;
  padding: 2px;
  background-color: transparent;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.base};
  cursor: pointer;
  &:hover {
    font-weight: bold;
  }
`;
export default Login;
