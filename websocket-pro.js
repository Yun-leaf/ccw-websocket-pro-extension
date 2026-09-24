/*
 * 高级 WebSocket 扩展 (Pro+ 修复版)
 * 原作者ccw_ID：259021803
 * 原扩展：assets.ccw.site/extension/advancedWebSocket
 * 
 * 原版基础改版作者ID：247323086
 * 原版基础改版扩展：assets.ccw.site/extension/MiaosAdvancedWebSocket
 * 
 * 二改 ↑ 版扩展：
 * 二次开发 & Bug 修复 & 图标添加：云叶 + deepseek
 * 日期：2026-09-24
 * 描述：修复重连丢失 URL、内存泄漏等Bug，增强健壮性，并加入CCW标准图标格式。
 * 基于原改版二次开发，如侵权，请联系删除，联系方式 → ccw主页
 * 如发布于ccw社区，无法保证是否受ccw于2026年8月末加入的CSP（内容安全策略），如被拦截，请自行反馈表单
 */
(function (_Scratch) {
    const { ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime } = _Scratch;

    // --- 扩展页大图 Base64 ---
    const ws_icon_big = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNjguMjUwMjgxODYiIGhlaWdodD0iMTQ2LjcyMTIxMTg4IiB2aWV3Qm94PSItMzA0LjcxNjI2OTg1IC0yOC4yMzk4MjY0OCAyNjguMjUwMjgxODYgMTQ2LjcyMTIxMTg4Ij48ZGVmcz48c3R5bGU+QGZvbnQtZmFjZXtmb250LWZhbWlseToiVHNhbmdlcll1TW8gVzAzIjtzcmM6dXJsKGRhdGE6Zm9udC90dGY7YmFzZTY0LFQxUlVUd0FLQUlBQUF3QWdRMFpHSUZjalVnUUFBQWEwQUFBR3FrOVRMekpyVEdUSkFBQUJFQUFBQUdCamJXRndCS1VGb0FBQUJSQUFBQUdFYUdWaFpDL0grRndBQUFDc0FBQUFObWhvWldFSEN3SUVBQUFBNUFBQUFDUm9iWFI0RzUwQm5nQUFEV0FBQUFBMGJIUmhaMlYrQUFRQUFBMlVBQUFBRW0xaGVIQUFEVkFBQUFBQkNBQUFBQVp1WVcxbEFLSFdWQUFBQVhBQUFBT2ZjRzl6ZEFBREFBQUFBQWFVQUFBQUlBQUJBQUFBQVFBQWV2eVJQMThQUFBVQUF3UG9BQUFBQU9iYTJvOEFBQUFBNXRyYWp3QUEvelVDK3dNcEFBQUFBd0FDQUFBQUFBQUFBQUVBQUFQWS92TUFBQU1EQUFBQUFBTXhBQUVBQUFBQUFBQUFBQUFBQUFBQUFBQU5BQUJRQUFBTkFBQUFBd0lnQWZRQUJRQUFBb29DdXdBQUFJd0NpZ0s3QUFBQjN3QXhBUUlBQUFBQUFBQUFBQUFBQUFBQUFBQUJBQUFBQUFBQUFBQUFBQUFBV0ZoWVdBQkFBQ3NBZHdQWS92TUFBQU1wQU1zQUFBQUJBQUFBQUFJVUF5a0FJQUFnQUFBQUFBQXpBbW9BQUFBRUFBQUFBQUFDQUJZQUFBQUVBQUFBQVFBZUFBQUFBQUFFQUFBQUFnQU9BQjRBQUFBRUFBQUFBd0EwQUpvQUFBQUVBQUFBQkFBdUFDd0FBQUFFQUFBQUJRQVdBSVFBQUFBRUFBQUFCZ0FxQUZvQUFBQUVBQUFBQndBQ0FCWUFBQUFFQUFBQUNBQUNBQllBQUFBRUFBQUFDUUFDQUJZQUFBQUVBQUFBQ2dBQ0FCWUFBQUFFQUFBQUN3QUNBQllBQUFBRUFBQUFEQUFDQUJZQUFBQUVBQUFBRFFBQ0FCWUFBQUFFQUFBQURnQUNBQllBQUFBRUFBQUFFQUFlQUFBQUFBQUVBQUFBRVFBT0FCNEFBUUFBQUFBQUFBQUJBQmNBQVFBQUFBQUFBUUFQQU00QUFRQUFBQUFBQWdBSEFOMEFBUUFBQUFBQUF3QWFBUnNBQVFBQUFBQUFCQUFYQU9RQUFRQUFBQUFBQlFBTEFSQUFBUUFBQUFBQUJnQVZBUHNBQVFBQUFBQUFCd0FCQUJjQUFRQUFBQUFBQ0FBQkFCY0FBUUFBQUFBQUNRQUJBQmNBQVFBQUFBQUFDZ0FCQUJjQUFRQUFBQUFBQ3dBQkFCY0FBUUFBQUFBQURBQUJBQmNBQVFBQUFBQUFEUUFCQUJjQUFRQUFBQUFBRGdBQkFCY0FBUUFBQUFBQUVBQVBBTTRBQVFBQUFBQUFFUUFIQU4wQUF3QUJCQWtBQUFBQ0FCWUFBd0FCQkFrQUFRQWVBQUFBQXdBQkJBa0FBZ0FPQUI0QUF3QUJCQWtBQXdBMEFKb0FBd0FCQkFrQUJBQXVBQ3dBQXdBQkJBa0FCUUFXQUlRQUF3QUJCQWtBQmdBcUFGb0FBd0FCQkFrQUJ3QUNBQllBQXdBQkJBa0FDQUFDQUJZQUF3QUJCQWtBQ1FBQ0FCWUFBd0FCQkFrQUNnQUNBQllBQXdBQkJBa0FDd0FDQUJZQUF3QUJCQWtBREFBQ0FCWUFBd0FCQkFrQURRQUNBQllBQXdBQkJBa0FEZ0FDQUJZQUF3QUJCQWtBRUFBZUFBQUFBd0FCQkFrQUVRQU9BQjRBVkFCekFHRUFiZ0JuQUdVQWNnQlpBSFVBVFFCdkFDQUFWd0F3QURNQVVnQmxBR2NBZFFCc0FHRUFjZ0JVQUhNQVlRQnVBR2NBWlFCeUFGa0FkUUJOQUc4QUlBQlhBREFBTXdBZ0FGSUFaUUJuQUhVQWJBQmhBSElBVkFCekFHRUFiZ0JuQUdVQWNnQlpBSFVBVFFCdkFGY0FNQUF6QUZJQVpRQm5BSFVBYkFCaEFISUFWZ0JsQUhJQWN3QnBBRzhBYmdBZ0FEQUFMZ0F4QUNBQU9nQWdBRlFBY3dCaEFHNEFad0JsQUhJQVdRQjFBRTBBYndBZ0FGY0FNQUF6QUNBQVVnQmxBR2NBZFFCc0FHRUFjbFJ6WVc1blpYSlpkVTF2SUZjd00xSmxaM1ZzWVhKVWMyRnVaMlZ5V1hWTmJ5QlhNRE1nVW1WbmRXeGhjbFJ6WVc1blpYSlpkVTF2VnpBelVtVm5kV3hoY2xabGNuTnBiMjRnTUM0eElEb2dWSE5oYm1kbGNsbDFUVzhnVnpBeklGSmxaM1ZzWVhJQUFBQUFBUUFEQUFFQUFBQU1BQVFCZUFBQUFGb0FRQUFGQUJvQUFBQUJBQUlBQXdBRUFBVUFCZ0FIQUFnQUNRQUtBQXNBREFBTkFBNEFEd0FRQUJFQUVnQVRBQlFBRlFBV0FCY0FHQUFaQUJvQUd3QWNBQjBBSGdBZkFDQUFLd0JpQUdNQVpRQnJBRzhBY0FCeUFITUFkQUIzLy84QUFBQUFBQUVBQWdBREFBUUFCUUFHQUFjQUNBQUpBQW9BQ3dBTUFBMEFEZ0FQQUJBQUVRQVNBQk1BRkFBVkFCWUFGd0FZQUJrQUdnQWJBQndBSFFBZUFCOEFJQUFyQUdJQVl3QmxBR3NBYndCd0FISUFjd0IwQUhmLy93QUpBQWdBQndBR0FBVUFCQUFEQUFJQUFRQUEvLy8vL3YvOS8vei8rLy82Ly9uLytQLzMvL2IvOWYvMC8vUC84di94Ly9ELzcvL3UvKzMvN1Avci8rci82Zi9oLzZIL28vK2QvNXovbHYrYS81bi9rZitVLzRvQUFRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQURBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVFBRUFRQUJBUUVXVkhOaGJtZGxjbGwxVFc5WE1ETlNaV2QxYkdGeUFBRUJBU2o0R3dENEhBTDRIUVA0SGdTTCsxLzZiUG1YQlIwQUFBQ05EeDBBQUFDbUVZc2RBQUFHcWhJQUJRRUJEQ015T1RsV1pYSnphVzl1SURBdU1WUnpZVzVuWlhKWmRVMXZJRmN3TXlCU1pXZDFiR0Z5VkhOaGJtZGxjbGwxVFc4Z1Z6QXpVbVZuZFd4aGNnQUFBQUdMQVlzQml3R0xBWXNCaXdHTEFZc0Jpd0dMQVlzQml3QU5BZ0FCQUFRQWRRRUlBYjRDcVFOVUEvSUVSZ1M5Qk1BRll3V3pCZWI0aUE3NWwvZ1Q5K1FWSS92bEJVS0xCWHVMZ0kyRmtBaUxpd1dGajRhVWhwb0lpNHNGK3kzNGhnWDNEWXNGOGZ3R0JmUDM2UVhVaXdXaGk1aURrSHNJaTRzRnB5K3RJYkw3REFpTGl3WHYrQWNGOXdxTEJmczIvS2tGUG9zRmRJdDdsNFNrQ0l1TEJYRGhiTzltOXdZSWk0c0ZEdmp5OTh6b0ZlQ0x2YXliekFpTGl3WHRlZ1Y3U1c5Y1luQUlpNHNGWlhCVWZrS0xDSXVMQlRPTFI2TmN1Z2lMaXdWY3VuVE9pK0FJaTRzRmkvZE41ZWozU0lzSWk0c0Y5ejJMNFRDUSswc0lpNHNGakhXQ2dIZUxDSXVMQmZ3WWl3V01XSmxucG5RSWk0c0ZwSGF6Z01HTENJdUxCZnN3OTNjVjk3bUxCWURmVzdVM2l3aUxpd1V1aTFsaGhEY0lpNHNGRHZrRDkvTDRyaFhVaThSenRWc0lpNHNGdFZtZ1Jvc3lDSXVMQllzNGQwcGlXd2lMaXdWaVdsRnpRWXNJaTRzRlBJdFNtbWFxQ0l1TEJZdHBCZnNJaXdXTCtXc0ZpNnFJcG9haUNJdUxCY1o3dElhamtBaUxpd1dMKzdnRnJxVEVsOXVMQ0l1TEJYVDhUaFhyaTd2QmkvY0FDSXVMQll2RWZyWndxUWlMaXdWeXFHZWFYb3NJaTRzRlg0dHJobmFBQ0l1TEJYU0FlM2lBYndpTGl3V0wrMG9GbUcyY2RxR0FDSXVMQmFCL3JJVzJpd2lMaXdVTytLMzN4L2ZNRmRDQ3ZYaXBjQWlMaXdXb2NabGxpMWtJaTRzRmkxVjdaR3QwQ0l1TEJXcHlVbjQ2aXdpTGl3VXhpMHlaYUtZSWk0c0ZhcVI0dW9iUENJdUxCZmNBbHdXU1lwWndtbjhJaTRzRm5IMnZoTUNMQ0l1TEJkS0xyNkNMdEFpTGl3V0xvb09iZTVZSWk0c0ZlcFpyazE2UkNJdUxCVEdYVFo5cXFBaUxpd1Z1cEh5eGk3OElpNHNGaTcyY3NLeWpDSXVMQmE2bHhwamNpd2lMaXdYY2k4T0FxblFJaTRzRnFuU2RYWkJJQ0l1TEJTSjhCWW12Z3FSN21BaUxpd1Y2bUcyU1g0c0lpNHNGUDR0bGQ0dGtDSXVMQll0MGxIdWRnQWlMaXdXZ2ZyYUJ5NElJaTRzRkR2anpydmVoRll2cm9OQzB0Z2lMaXdXMHQ5Q2g2b3NJaTRzRjZJdlBkYlplQ0l1TEJiVmdvRWFMTEFpTGl3V0xLblpFWW1BSWk0c0ZZVjlIZFN5TENJdUxCU3lMUjZGaXRnaUxpd1ZodG5iUmkrNElpNHNGOXdPS0ZZdEpsMTJqY0FpTGl3V2ljck4reElzSWk0c0Z4SXV5bDZLa0NJdUxCYU9sbDdxTHpnaUxpd1dMekg2NmNxWUlpNHNGYzZSa21GV0xDSXVMQlZLTFluNTBjZ2lMaXdWMGNYOWRpMGdJaTRzRkR2alQrRWIzZXhYeWRBVjhPM0ZUWkdzSWk0c0ZaV3RSZXo2TENJdUxCZnM2aXpqa2kvZEdDSXVMQll2M1Q5N3A5enVMQ0l1TEJkQ0x3SDZ4Y1FpTGl3V3liNmhkbmtvSWk0c0ZLR3NGZ3JWN3FYU2NDSXVMQlhXY2E1Tmlpd2lMaXdWWmkyZDlkSEFJaTRzRmMyNS9YSXRLQ0l1TEJZdE9sMTZqY0FpTGl3V2ljcTkrdklzSWk0c0Z0NHVzbGFDZ0NJdUxCYUtnbXJDVXZnaUxpd1VPK0x6MzUvZm5GZmRsKytjRit3T1lCWEI4QlV2M0FsbmdaOGdJaTRzRlBEWUZpL3M4QmZzTml3V0wrVlFGaTY2SXA0V2dDSXVMQmNoN3RvYWxrQWlMaXdXTC9FOEY5MW4zWndYM0tJc0YrMC83WGdVTytFRDNrZmhLRll2N293V0xhNVIzbm9RSWk0c0ZvSUswamNlWkNJdUxCWC83QVFVdWZrbVJaS1VJaTRzRlpxTjV1WXZQQ0l1TEJZdjNwd1ZXaTJXTGNvb0lpNHNGazhrRmdxNEY5d21MQll2M0VBV0xwWWloaFowSWk0c0Z4bnkxaHFLUUNJdUxCWXY3UXdYM0g0c0ZmeW9GK3hPTUJRNzNqZzc0K1BmbytMUVYzSXZHZHE5Z0NJdUxCYkplbmtDTElnaUxpd1dMKzBZOU12c3dpd2lMaXdWQmkxU1lacVlJaTRzRmkvdDdCZnNHaXdXTCtUWUZpNmFJcElhZ0NJdUxCYjZDc1lpbGp3aUxpd1dQYUFXenFNT1oxSXNJaTRzRmN2eFlGYitMc0plaG9naUxpd1dpcEphMWk4Z0lpNHNGaTlHQXZIV25DSXVMQlhhbVpaaFdpd2lMaXdWRWkxeDNkR0lJaTRzRmkvdDBCYUZndW5YVGl3aUxpd1VPK0MvM3VQaXZGZStMQlg3N0J3VTJsVk9GY25ZSWk0c0ZjblorVjRzNENJdUxCWXY3andYN0Jvc0ZpL2lDQll1aWlaeUdsd2lMaXdXOWdiR0pwcEFJaTRzRmkxb0ZscXkwbTlLTENJdUxCUTc0NmEvNFNCV0xLQVgzWW9zRmkvdGxCZmFMQll2M1pRWDNZWXNGaSs0RisyR0xCWXYzWndVZ2l3V0wrMmNGKzJLTEJRNEFBQUgwQUFBREF3QUVBbDRBSlFKdkFEWUNHUUFqQWw4QUl3SS9BQ01DS0FBekFhd0FGUUQ2QUFBQ1pBQTBBWnNBTmdKVkFDUUFBQUFCQUFBQUFBQUFBQUVBRUFBQ1pXNEFBQT09KSBmb3JtYXQoInRydWV0eXBlIik7fTwvc3R5bGU+PC9kZWZzPjxwYXRoIGRhdGEtcDItaWQ9Im4xYmFzZGRuMjA0cWkiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgLTI0LjQ2NTk4Nzk5IC0xMS41MTg2MTQ1OSkiIGQ9Ik0gLTI4MC4yNTAyODE4NiAtMTYuNzIxMjExODggTCAtMTIgLTE2LjcyMTIxMTg4IEwgLTEyIDEzMCBMIC0yODAuMjUwMjgxODYgMTMwIEwgLTI4MC4yNTAyODE4NiAtMTYuNzIxMjExODggWiIgZmlsbD0iI2Q0ZTFmZiIvPjxwYXRoIGRhdGEtcDItaWQ9Im53ZXE2eDdmYjNnOSIgZD0iTSAtMTkwLjE4MjI1Nzg0IDc1LjI3Mjk0MzYgTCAtMTkwLjE4MjI1Nzg0IDEwMi40NTQwOTI0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTdhZmZmIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGRhdGEtcDItaWQ9Im52ajdpM3djMGRjMiIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAzNy41IDMuNzcyOTQzNikiIGQ9Ik0gLTI2My4zNjQ1MTU2OCAzMi44NTQxMzcyMSBDIC0yNjMuMzY0NTE1NjggMjcuMTEwMzYyMzMgLTI1OC43MDgyNjYxNCAyMi40NTQxMTI4IC0yNTIuOTY0NDkxMjYgMjIuNDU0MTEyOCBMIC0yMDIuNDAwMDI0NDEgMjIuNDU0MTEyOCBDIC0xOTYuNjU2MjQ5NTMgMjIuNDU0MTEyOCAtMTkyIDI3LjExMDM2MjMzIC0xOTIgMzIuODU0MTM3MjEgTCAtMTkyIDU5LjU5OTk3NTU5IEMgLTE5MiA2NS4zNDM3NTA0NyAtMTk2LjY1NjI0OTUzIDcwIC0yMDIuNDAwMDI0NDEgNzAgTCAtMjUyLjk2NDQ5MTI2IDcwIEMgLTI1OC43MDgyNjYxNCA3MCAtMjYzLjM2NDUxNTY4IDY1LjM0Mzc1MDQ3IC0yNjMuMzY0NTE1NjggNTkuNTk5OTc1NTkgTCAtMjYzLjM2NDUxNTY4IDMyLjg1NDEzNzIxIFoiIGZpbGw9IiNhM2MyZWUiIHN0cm9rZT0iIzk3YWZmZiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkYXRhLXAyLWlkPSJueWo0cmUwdmJsbnkiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgMTYuMjU0NTI4NTMgMS41OTk5NzU1OSkiIGQ9Ik0gLTIzOS40NzE5MDM4MyAxMDAuODU0MTE2ODcgTCAtMTczLjQwMTY2ODkgMTAwLjg1NDExNjg3IiBmaWxsPSJub25lIiBzdHJva2U9IiM5N2FmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZGF0YS1wMi1pZD0ibjE0bHh2OWQ1b3Z0dyIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSA5NS4zNjQ1MTU2OCAtMjIuNDk4Nzc5NjgpIiBkPSJNIC0xOTAuMTgyMjU3ODQgNzUuMjcyOTQzNiBMIC0xOTAuMTgyMjU3ODQgMTAyLjQ1NDA5MjQ1IiBmaWxsPSJub25lIiBzdHJva2U9IiM5N2FmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZGF0YS1wMi1pZD0ibjE1bWd4ZzRlZmcyMyIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAxMzIuODY0NTE1NjggLTE2LjcyNTgzNjA4KSIgZD0iTSAtMjYzLjM2NDUxNTY4IDMyLjg1NDEzNzIxIEMgLTI2My4zNjQ1MTU2OCAyNy4xMTAzNjIzMyAtMjU4LjcwODI2NjE0IDIyLjQ1NDExMjggLTI1Mi45NjQ0OTEyNiAyMi40NTQxMTI4IEwgLTIwMi40MDAwMjQ0MSAyMi40NTQxMTI4IEMgLTE5Ni42NTYyNDk1MyAyMi40NTQxMTI4IC0xOTIgMjcuMTEwMzYyMzMgLTE5MiAzMi44NTQxMzcyMSBMIC0xOTIgNTkuNTk5OTc1NTkgQyAtMTkyIDY1LjM0Mzc1MDQ3IC0xOTYuNjU2MjQ5NTMgNzAgLTIwMi40MDAwMjQ0MSA3MCBMIC0yNTIuOTY0NDkxMjYgNzAgQyAtMjU4LjcwODI2NjE0IDcwIC0yNjMuMzY0NTE1NjggNjUuMzQzNzUwNDcgLTI2My4zNjQ1MTU2OCA1OS41OTk5NzU1OSBMIC0yNjMuMzY0NTE1NjggMzIuODU0MTM3MjEgWiIgZmlsbD0iI2EzYzJlZSIgc3Ryb2tlPSIjOTdhZmZmIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGRhdGEtcDItaWQ9Im4xN3I0c2c1cmlvNjgiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgMTExLjYxOTA0NDIxIC0xOC44OTg4MDQwOSkiIGQ9Ik0gLTIzOS40NzE5MDM4MyAxMDAuODU0MTE2ODcgTCAtMTczLjQwMTY2ODkgMTAwLjg1NDExNjg3IiBmaWxsPSJub25lIiBzdHJva2U9IiM5N2FmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZGF0YS1wMi1pZD0ibjEzaDE5bmhnczYzayIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAwIDE3Ljc1MjE2MDA3KSIgZD0iTSAtMTYyLjU2NDUwNzU0IDU1LjUyMDc4MzUzIEwgLTEwNi41NjQ0NjY4NSAzNC43MjA3NzU0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2OTY1ZGEiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZGF0YS1wMi1pZD0ibjExbDBhajk4MXljMCIgZD0iTSAtMTYyLjU2NDUwNzU0IDU1LjUyMDc4MzUzIEwgLTEwNi41NjQ0NjY4NSAzNC43MjA3NzU0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2OTY1ZGEiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZGF0YS1wMi1pZD0ibjFhZHJqZ2cyYnQyaCIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAyMi42MDg5OTk0MiA1NS4wODcyNTc3KSIgZD0iTSAtMTU2LjQwODk2Njg2IC0zNC4wNzQ2OTU2OSBMIC0xNjguMTQyMjgzOTIgLTQuMjA4MDM3MTYgTCAtMTc0LjkxMTE1MDQxIDExLjI3NzQ4MDY1IEwgLTE1MS45Nzc4MDA4IC04Ljk4OTE2MTYgQyAtMTUxLjk3NzgwMDggLTguOTg5MTYxNiAtMTU2Ljg5NTAxMzYzIC0xMS40MDYwMjc2OCAtMTYzLjM0MjMxNjQ3IC0xMS42NzQ2NzEyOCBDIC0xNjkuNjk0MzEyMDQgLTExLjkzOTM0MzY1IC0xNzUuNjA4OTk5NDIgLTEzLjgwODAxMjc1IC0xNzUuNjA4OTk5NDIgLTEzLjgwODAxMjc1IEwgLTE1Ni40MDg5NjY4NiAtMzQuMDc0Njk1NjkgWiIgZmlsbD0iIzA1MzY3YSIvPjx0ZXh0IGRhdGEtcDItaWQ9Im4xY2h4cjdiMWQzN2QiIHRyYW5zZm9ybT0ibWF0cml4KDAuNzI0Njg1OTUgMCAwIDAuNzI0Njg1OTUgLTI5Mi40NjQxNDAxOSAtMjQuMTc5NDEyNTEpIiBmb250LWZhbWlseT0iJnF1b3Q7VHNhbmdlcll1TW8gVzAzJnF1b3Q7LCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjMyIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIGZpbGw9IiMwMDAwMDAiPjx0c3BhbiB4PSIwIiB5PSIzMC4yIj53ZWJzb2NrZXQgcHJvKzwvdHNwYW4+PC90ZXh0Pjwvc3ZnPg==";
    
    // --- 积木面板小图 Base64 ---
    const ws_icon_small = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIxNjkuNzI5MDMxMzUiIGhlaWdodD0iMTAwLjIyNTgxNTczIiB2aWV3Qm94PSItMjI3LjM2NDUxNTY4IDQuMjI4Mjc2NzIgMTY5LjcyOTAzMTM1IDEwMC4yMjU4MTU3MyI+PHBhdGggZGF0YS1wMi1pZD0ibndlcTZ4N2ZiM2c5IiBkPSJNIC0xOTAuMTgyMjU3ODQgNzUuMjcyOTQzNiBMIC0xOTAuMTgyMjU3ODQgMTAyLjQ1NDA5MjQ1IiBmaWxsPSJub25lIiBzdHJva2U9IiM5N2FmZmYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZGF0YS1wMi1pZD0ibnZqN2kzd2MwZGMyIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDM3LjUgMy43NzI5NDM2KSIgZD0iTSAtMjYzLjM2NDUxNTY4IDMyLjg1NDEzNzIxIEMgLTI2My4zNjQ1MTU2OCAyNy4xMTAzNjIzMyAtMjU4LjcwODI2NjE0IDIyLjQ1NDExMjggLTI1Mi45NjQ0OTEyNiAyMi40NTQxMTI4IEwgLTIwMi40MDAwMjQ0MSAyMi40NTQxMTI4IEMgLTE5Ni42NTYyNDk1MyAyMi40NTQxMTI4IC0xOTIgMjcuMTEwMzYyMzMgLTE5MiAzMi44NTQxMzcyMSBMIC0xOTIgNTkuNTk5OTc1NTkgQyAtMTkyIDY1LjM0Mzc1MDQ3IC0xOTYuNjU2MjQ5NTMgNzAgLTIwMi40MDAwMjQ0MSA3MCBMIC0yNTIuOTY0NDkxMjYgNzAgQyAtMjU4LjcwODI2NjE0IDcwIC0yNjMuMzY0NTE1NjggNjUuMzQzNzUwNDcgLTI2My4zNjQ1MTU2OCA1OS41OTk5NzU1OSBMIC0yNjMuMzY0NTE1NjggMzIuODU0MTM3MjEgWiIgZmlsbD0iI2EzYzJlZSIgc3Ryb2tlPSIjOTdhZmZmIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGRhdGEtcDItaWQ9Im55ajRyZTB2YmxueSIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAxNi4yNTQ1Mjg1MyAxLjU5OTk3NTU5KSIgZD0iTSAtMjM5LjQ3MTkwMzgzIDEwMC44NTQxMTY4NyBMIC0xNzMuNDAxNjY4OSAxMDAuODU0MTE2ODciIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk3YWZmZiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkYXRhLXAyLWlkPSJuMTRseHY5ZDVvdnR3IiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDk1LjM2NDUxNTY4IC0yMi40OTg3Nzk2OCkiIGQ9Ik0gLTE5MC4xODIyNTc4NCA3NS4yNzI5NDM2IEwgLTE5MC4xODIyNTc4NCAxMDIuNDU0MDkyNDUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk3YWZmZiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkYXRhLXAyLWlkPSJuMTVtZ3hnNGVmZzIzIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDEzMi44NjQ1MTU2OCAtMTYuNzI1ODM2MDgpIiBkPSJNIC0yNjMuMzY0NTE1NjggMzIuODU0MTM3MjEgQyAtMjYzLjM2NDUxNTY4IDI3LjExMDM2MjMzIC0yNTguNzA4MjY2MTQgMjIuNDU0MTEyOCAtMjUyLjk2NDQ5MTI2IDIyLjQ1NDExMjggTCAtMjAyLjQwMDAyNDQxIDIyLjQ1NDExMjggQyAtMTk2LjY1NjI0OTUzIDIyLjQ1NDExMjggLTE5MiAyNy4xMTAzNjIzMyAtMTkyIDMyLjg1NDEzNzIxIEwgLTE5MiA1OS41OTk5NzU1OSBDIC0xOTIgNjUuMzQzNzUwNDcgLTE5Ni42NTYyNDk1MyA3MCAtMjAyLjQwMDAyNDQxIDcwIEwgLTI1Mi45NjQ0OTEyNiA3MCBDIC0yNTguNzA4MjY2MTQgNzAgLTI2My4zNjQ1MTU2OCA2NS4zNDM3NTA0NyAtMjYzLjM2NDUxNTY4IDU5LjU5OTk3NTU5IEwgLTI2My4zNjQ1MTU2OCAzMi44NTQxMzcyMSBaIiBmaWxsPSIjYTNjMmVlIiBzdHJva2U9IiM5N2FmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZGF0YS1wMi1pZD0ibjE3cjRzZzVyaW82OCIgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAxMTEuNjE5MDQ0MjEgLTE4Ljg5ODgwNDA5KSIgZD0iTSAtMjM5LjQ3MTkwMzgzIDEwMC44NTQxMTY4NyBMIC0xNzMuNDAxNjY4OSAxMDAuODU0MTE2ODciIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk3YWZmZiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkYXRhLXAyLWlkPSJuMTNoMTluaGdzNjNrIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDAgMTcuNzUyMTYwMDcpIiBkPSJNIC0xNjIuNTY0NTA3NTQgNTUuNTIwNzgzNTMgTCAtMTA2LjU2NDQ2Njg1IDM0LjcyMDc3NTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY5NjVkYSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkYXRhLXAyLWlkPSJuMTFsMGFqOTgxeWMwIiBkPSJNIC0xNjIuNTY0NTA3NTQgNTUuNTIwNzgzNTMgTCAtMTA2LjU2NDQ2Njg1IDM0LjcyMDc3NTQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzY5NjVkYSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkYXRhLXAyLWlkPSJuMWFkcmpnZzJidDJoIiB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAxIDIyLjYwODk5OTQyIDU1LjA4NzI1NzcpIiBkPSJNIC0xNTYuNDA4OTY2ODYgLTM0LjA3NDY5NTY5IEwgLTE2OC4xNDIyODM5MiAtNC4yMDgwMzcxNiBMIC0xNzQuOTExMTUwNDEgMTEuMjc3NDgwNjUgTCAtMTUxLjk3NzgwMDggLTguOTg5MTYxNiBDIC0xNTEuOTc3ODAwOCAtOC45ODkxNjE2IC0xNTYuODk1MDEzNjMgLTExLjQwNjAyNzY4IC0xNjMuMzQyMzE2NDcgLTExLjY3NDY3MTI4IEMgLTE2OS42OTQzMTIwNCAtMTEuOTM5MzQzNjUgLTE3NS42MDg5OTk0MiAtMTMuODA4MDEyNzUgLTE3NS42MDg5OTk0MiAtMTMuODA4MDEyNzUgTCAtMTU2LjQwODk2Njg2IC0zNC4wNzQ2OTU2OSBaIiBmaWxsPSIjMDUzNjdhIi8+PC9zdmc+";

    class AdvancedWebSocketExtension {
        constructor(runtime) {
            this.runtime = runtime;
            this.socket = null;
            this.reconnectAttempts = 0;
            this.maxReconnectAttempts = 5;
            this.reconnectInterval = 3000;
            this.messageQueue = [];
            this.connectionStatus = 'disconnected';
            this.lastMessagePayload = null;
            this.lastUrl = 'ws://localhost:8080';
            this.manualDisconnect = false;
            
            // 🌟 复活：项目停止时清理资源
            if (this.runtime && this.runtime.on) {
                this.runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
            }
        }

        getInfo() {
            return {
                id: 'MiaosAdvancedWebSocket_Yunleaf2026924',
                name: '高级WebSocket Pro+',
                color1: '#4A6FA5',
                color2: '#3B5888',
                blockIconURI: ws_icon_small,  // 积木上的小图标
                menuIconURI: ws_icon_small,   // 左侧分类栏的图标
                blocks: [
                    {
                        opcode: 'connect',
                        blockType: BlockType.COMMAND,
                        text: '连接服务器 [URL]',
                        arguments: {
                            URL: { type: ArgumentType.STRING, defaultValue: 'ws://localhost:8080' }
                        }
                    },
                    { opcode: 'disconnect', blockType: BlockType.COMMAND, text: '断开连接' },
                    {
                        opcode: 'sendText',
                        blockType: BlockType.COMMAND,
                        text: '发送文本消息 [TYPE] 内容:[TEXT]',
                        arguments: {
                            TYPE: { type: ArgumentType.STRING, defaultValue: 'message' },
                            TEXT: { type: ArgumentType.STRING, defaultValue: 'Hello Scratch!' }
                        }
                    },
                    {
                        opcode: 'sendJson',
                        blockType: BlockType.COMMAND,
                        text: '发送JSON消息 [TYPE] 内容:[JSON]',
                        arguments: {
                            TYPE: { type: ArgumentType.STRING, defaultValue: 'data' },
                            JSON: { type: ArgumentType.STRING, defaultValue: '{"key":"value"}' }
                        }
                    },
                    {
                        opcode: 'onTextMessage',
                        blockType: BlockType.HAT,
                        text: '当收到 [TYPE] 文本消息时',
                        isEdgeActivated: false,
                        arguments: {
                            TYPE: { type: ArgumentType.STRING, defaultValue: 'message' }
                        }
                    },
                    { opcode: 'lastMessage', blockType: BlockType.REPORTER, text: '最后收到的消息', disableMonitor: true },
                    { opcode: 'lastMessageType', blockType: BlockType.REPORTER, text: '最后收到的消息类型', disableMonitor: true },
                    { opcode: 'isConnected', blockType: BlockType.BOOLEAN, text: '已连接?' },
                    { opcode: 'getSessionId', blockType: BlockType.REPORTER, text: '会话ID', disableMonitor: true },
                    {
                        opcode: 'setReconnectPolicy',
                        blockType: BlockType.COMMAND,
                        text: '设置重连策略 次数:[ATTEMPTS] 间隔:[DELAY]ms',
                        arguments: {
                            ATTEMPTS: { type: ArgumentType.NUMBER, defaultValue: 5 },
                            DELAY: { type: ArgumentType.NUMBER, defaultValue: 3000 }
                        }
                    },
                    { opcode: 'onConnect', blockType: BlockType.HAT, text: '当连接成功时', isEdgeActivated: false },
                    { opcode: 'onDisconnect', blockType: BlockType.HAT, text: '当连接断开时', isEdgeActivated: false },
                    {
                        opcode: 'sendCommand',
                        blockType: BlockType.COMMAND,
                        text: '发送命令 [COMMAND] 参数:[PARAMS]',
                        arguments: {
                            COMMAND: { type: ArgumentType.STRING, defaultValue: 'move' },
                            PARAMS: { type: ArgumentType.STRING, defaultValue: 'forward' }
                        }
                    },
                    {
                        opcode: 'onCommand',
                        blockType: BlockType.HAT,
                        text: '当收到命令 [COMMAND]',
                        isEdgeActivated: false,
                        arguments: {
                            COMMAND: { type: ArgumentType.STRING, defaultValue: 'move' }
                        }
                    },
                    { opcode: 'getCommandParam', blockType: BlockType.REPORTER, text: '命令参数', disableMonitor: true }
                ],
                menus: {
                    messageType: ['message', 'data', 'command', 'status'],
                    commandType: ['move', 'jump', 'rotate', 'color']
                }
            };
        }

        connect(args) {
            this.disconnect(); // 先断开旧连接
            this.manualDisconnect = false;
            this.connectionStatus = 'connecting';
            this.lastUrl = args.URL; // 🌟 修复：保存 URL，重连时用
            
            try {
                this.socket = new WebSocket(args.URL);
                
                this.socket.onopen = () => {
                    this.connectionStatus = 'connected';
                    this.reconnectAttempts = 0;
                    this.flushMessageQueue();
                    this.runtime.startHats('MiaosAdvancedWebSocket_onConnect');
                    console.log('WebSocket连接成功');
                };
                
                this.socket.onmessage = (event) => {
                    if (typeof event.data === 'string') {
                        this.handleTextMessage(event.data);
                    } else {
                        this.handleBinaryMessage(event.data);
                    }
                };
                
                this.socket.onclose = (event) => {
                    this.connectionStatus = 'disconnected';
                    this.runtime.startHats('MiaosAdvancedWebSocket_onDisconnect');
                    console.log(`连接关闭，代码: ${event.code}, 原因: ${event.reason}`);
                    
                    // 🌟 修复：如果不是手动断开，且不是正常关闭，才尝试重连
                    if (!this.manualDisconnect && event.code !== 1000) {
                        this.handleReconnect();
                    }
                };
                
                this.socket.onerror = (error) => {
                    console.error('WebSocket错误:', error);
                };
            } catch (e) {
                console.error('连接异常:', e);
                if (!this.manualDisconnect) {
                    this.handleReconnect();
                }
            }
        }

        disconnect() {
            this.manualDisconnect = true; // 🌟 修复：标记为手动断开
            if (this.socket) {
                this.socket.close(1000, '用户主动断开');
                this.socket = null;
            }
            this.connectionStatus = 'disconnected';
            this.reconnectAttempts = 0;
            this.messageQueue = []; // 🌟 修复：清空消息队列
        }

        handleTextMessage(data) {
            try {
                const message = JSON.parse(data);
                this.lastMessagePayload = message;
                
                if (message.type == 'command') {
                    this.runtime.startHats('MiaosAdvancedWebSocket_onCommand', {
                        COMMAND: message.command
                    });
                } else {
                    this.runtime.startHats('MiaosAdvancedWebSocket_onTextMessage', {
                        TYPE: message.type || 'message'
                    });
                }
            } catch (e) {
                this.lastMessagePayload = { type: 'text', data: data };
                this.runtime.startHats('MiaosAdvancedWebSocket_onTextMessage', { TYPE: 'text' });
            }
        }

        handleBinaryMessage(data) {
            console.log('收到二进制数据:', data);
        }

        sendText(args) {
            const message = JSON.stringify({ type: args.TYPE, data: args.TEXT, timestamp: Date.now() });
            this.queueOrSend(message);
        }

        sendJson(args) {
            try {
                const jsonData = JSON.parse(args.JSON);
                const message = JSON.stringify({ type: args.TYPE, data: jsonData, timestamp: Date.now() });
                this.queueOrSend(message);
            } catch (e) {
                console.error('无效的JSON格式:', e);
            }
        }

        sendCommand(args) {
            const message = JSON.stringify({ type: 'command', command: args.COMMAND, params: args.PARAMS, timestamp: Date.now() });
            this.queueOrSend(message);
        }

        queueOrSend(message) {
            if (this.connectionStatus === 'connected' && this.socket) {
                this.socket.send(message);
            } else {
                this.messageQueue.push(message);
                if (this.connectionStatus === 'disconnected' && !this.manualDisconnect && this.reconnectAttempts === 0) {
                    this.handleReconnect();
                }
            }
        }

        flushMessageQueue() {
            while (this.messageQueue.length > 0 && this.connectionStatus === 'connected') {
                this.socket.send(this.messageQueue.shift());
            }
        }

        handleReconnect() {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                
                setTimeout(() => {
                    // 🌟 修复：使用保存的 lastUrl
                    if (this.connectionStatus === 'disconnected' && !this.manualDisconnect) {
                        this.connect({ URL: this.lastUrl });
                    }
                }, this.reconnectInterval);
            } else {
                console.log('达到最大重连次数，停止重试');
            }
        }

        setReconnectPolicy(args) {
            this.maxReconnectAttempts = Math.max(0, Math.floor(args.ATTEMPTS));
            this.reconnectInterval = Math.max(500, Math.floor(args.DELAY));
            console.log(`设置重连策略: 次数=${this.maxReconnectAttempts}, 间隔=${this.reconnectInterval}ms`);
        }

        stopAll() {
            this.disconnect();
        }

        // ----- 积木操作实现 -----
        onTextMessage(args) {
            // 🌟 修复：用 == 避免类型不匹配
            return this.lastMessagePayload?.type == args.TYPE;
        }

        onCommand(args) {
            return this.lastMessagePayload?.type == 'command' && this.lastMessagePayload?.command == args.COMMAND;
        }

        lastMessage() {
            // 🌟 修复：如果是对象，转成字符串输出，防止变成 [object Object]
            if (typeof this.lastMessagePayload?.data === 'object') {
                return JSON.stringify(this.lastMessagePayload.data);
            }
            return this.lastMessagePayload?.data || '';
        }

        lastMessageType() {
            return this.lastMessagePayload?.type || '';
        }

        getSessionId() {
            return this.sessionId || '';
        }

        isConnected() {
            return this.connectionStatus === 'connected';
        }

        getCommandParam() {
            return this.lastMessagePayload?.params || '';
        }
    }

    // 注册扩展
    Scratch.extensions.register(new AdvancedWebSocketExtension());
}(Scratch));
