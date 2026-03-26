import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, LoginResponse, User } from "../../types/auth";

// 简单的内存存储，用于演示
let users: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    password: "admin123", // 实际项目中应该使用密码哈希
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "系统"
  },
  {
    id: "2",
    username: "user",
    email: "user@example.com",
    password: "user123", // 实际项目中应该使用密码哈希
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "系统"
  }
];

// 生成简单的token（实际项目中应该使用JWT）
function generateToken(user: any): string {
  return btoa(JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role,
    timestamp: Date.now()
  }));
}

// 登录功能
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // 查找用户
    const user = users.find(u => u.username === username);
    if (!user) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // 验证密码（实际项目中应该使用密码哈希验证）
    if (user.password !== password) {
      return NextResponse.json<LoginResponse>(
        { success: false, error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    // 生成token
    const token = generateToken(user);

    return NextResponse.json<LoginResponse>({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error("登录错误:", error);
    return NextResponse.json<LoginResponse>(
      { success: false, error: "网络错误，请稍后重试" },
      { status: 500 }
    );
  }
}

// 获取用户列表
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error("获取用户列表错误:", error);
    return NextResponse.json(
      { success: false, error: "网络错误，请稍后重试" },
      { status: 500 }
    );
  }
}

// 添加用户
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, role } = body;

    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
      return NextResponse.json(
        { success: false, error: "用户名已存在" },
        { status: 400 }
      );
    }

    // 从请求头中获取token并解析出当前登录用户
    let createdBy = "系统";
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        createdBy = decoded.username || "系统";
      } catch (error) {
        console.error("解析token失败:", error);
      }
    }

    // 创建新用户
    const newUser: User = {
      id: (users.length + 1).toString(),
      username,
      email: `${username}@example.com`,
      password, // 实际项目中应该使用密码哈希
      role: role || "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy
    };

    users.push(newUser);

    return NextResponse.json({
      success: true,
      user: newUser
    });
  } catch (error) {
    console.error("添加用户错误:", error);
    return NextResponse.json(
      { success: false, error: "网络错误，请稍后重试" },
      { status: 500 }
    );
  }
}

// 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "用户ID不能为空" },
        { status: 400 }
      );
    }

    // 不允许删除admin用户
    if (userId === "1") {
      return NextResponse.json(
        { success: false, error: "不能删除管理员账户" },
        { status: 400 }
      );
    }

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, error: "用户不存在" },
        { status: 404 }
      );
    }

    users.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: "用户删除成功"
    });
  } catch (error) {
    console.error("删除用户错误:", error);
    return NextResponse.json(
      { success: false, error: "网络错误，请稍后重试" },
      { status: 500 }
    );
  }
}
