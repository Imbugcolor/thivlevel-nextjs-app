'use client'

import React, { FormEvent, useState } from 'react'
import { trackGenerateLead } from '@/lib/analytics'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    setMessage('')
    setError('')
    setSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: 'website_footer',
          website,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Không thể đăng ký nhận ưu đãi.')
      }

      setMessage('Đăng ký thành công! Bạn sẽ nhận được ưu đãi mới từ ThivLevel.')
      setEmail('')
      trackGenerateLead('newsletter_footer')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể đăng ký nhận ưu đãi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <h4 className="footer-item-header">NHẬN ƯU ĐÃI MỚI</h4>
      <p>Đăng ký email để nhận thông tin sản phẩm và chương trình ưu đãi.</p>
      <div className="newsletter-form-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email của bạn"
          autoComplete="email"
          required
          aria-label="Email nhận ưu đãi"
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Đăng ký'}
        </button>
      </div>
      <input
        className="newsletter-honeypot"
        type="text"
        name="website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {message && <p className="newsletter-message success" role="status">{message}</p>}
      {error && <p className="newsletter-message error" role="alert">{error}</p>}
      <small>Bằng việc đăng ký, bạn đồng ý nhận email ưu đãi và có thể hủy đăng ký bất kỳ lúc nào.</small>
    </form>
  )
}
