package config

type RouteRegistry struct {
	Auth      AuthRoutes
	Protected ProtectedRoutes
}

type AuthRoutes struct {
	Base     string
	Register string
	Login    string
}

type ProtectedRoutes struct {
	Base    string
	Profile string
}

func NewRouteRegistry() *RouteRegistry {
	return &RouteRegistry{
		Auth: AuthRoutes{
			Base:     "/auth",
			Register: "/register",
			Login:    "/login",
		},
		Protected: ProtectedRoutes{
			Base:    "/protected",
			Profile: "/profile",
		},
	}
}
