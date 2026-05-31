FROM node:20-alpine AS build
WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_STRIPE_PUBLISHABLE_KEY
ARG VITE_EMAILJS_SERVICE_ID
ARG VITE_EMAILJS_PUBLIC_KEY
ARG VITE_EMAILJS_RECEIPT_TEMPLATE_ID
ARG VITE_EMAILJS_CONTACT_TEMPLATE_ID

COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
