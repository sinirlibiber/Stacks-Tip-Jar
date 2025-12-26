;; Stacks Tip Jar - Mainnet Smart Contract
;; Sosyal bahşiş platformu için Clarity akıllı kontratı

;; Error kodları
(define-constant ERR-INVALID-AMOUNT (err u100))
(define-constant ERR-TRANSFER-FAILED (err u101))
(define-constant ERR-INVALID-RECIPIENT (err u102))

;; Veri yapıları
(define-map tips
  { tip-id: uint }
  {
    sender: principal,
    recipient: principal,
    amount: uint,
    message: (string-utf8 280),
    block-height: uint,
    timestamp: uint
  }
)

(define-map user-stats
  { user: principal }
  {
    total-received: uint,
    total-sent: uint,
    tip-count: uint
  }
)

;; Sayaç
(define-data-var tip-counter uint u0)

;; Bahşiş gönderme fonksiyonu
(define-public (send-tip (recipient principal) (amount uint) (message (string-utf8 280)))
  (let
    (
      (tip-id (var-get tip-counter))
      (sender tx-sender)
    )
    
    ;; Validasyonlar
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (not (is-eq sender recipient)) ERR-INVALID-RECIPIENT)
    
    ;; STX transferi
    (match (stx-transfer? amount sender recipient)
      success
        (begin
          ;; Tip kaydını oluştur
          (map-set tips
            { tip-id: tip-id }
            {
              sender: sender,
              recipient: recipient,
              amount: amount,
              message: message,
              block-height: block-height,
              timestamp: (unwrap-panic (get-block-info? time block-height))
            }
          )
          
          ;; Gönderen istatistiklerini güncelle
          (map-set user-stats
            { user: sender }
            (merge
              (default-to
                { total-received: u0, total-sent: u0, tip-count: u0 }
                (map-get? user-stats { user: sender })
              )
              { total-sent: (+ amount (get total-sent (default-to { total-received: u0, total-sent: u0, tip-count: u0 } (map-get? user-stats { user: sender })))) }
            )
          )
          
          ;; Alıcı istatistiklerini güncelle
          (map-set user-stats
            { user: recipient }
            (merge
              (default-to
                { total-received: u0, total-sent: u0, tip-count: u0 }
                (map-get? user-stats { user: recipient })
              )
              {
                total-received: (+ amount (get total-received (default-to { total-received: u0, total-sent: u0, tip-count: u0 } (map-get? user-stats { user: recipient })))),
                tip-count: (+ u1 (get tip-count (default-to { total-received: u0, total-sent: u0, tip-count: u0 } (map-get? user-stats { user: recipient }))))
              }
            )
          )
          
          ;; Sayacı artır
          (var-set tip-counter (+ tip-id u1))
          
          ;; Event print
          (print {
            event: "tip-sent",
            tip-id: tip-id,
            sender: sender,
            recipient: recipient,
            amount: amount,
            message: message
          })
          
          (ok tip-id)
        )
      error ERR-TRANSFER-FAILED
    )
  )
)

;; Read-only fonksiyonlar
(define-read-only (get-tip (tip-id uint))
  (map-get? tips { tip-id: tip-id })
)

(define-read-only (get-user-stats (user principal))
  (default-to
    { total-received: u0, total-sent: u0, tip-count: u0 }
    (map-get? user-stats { user: user })
  )
)

(define-read-only (get-tip-count)
  (var-get tip-counter)
)
